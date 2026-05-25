import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X, Plus } from "lucide-react";
import api from "../../utils/api";

const SkillsAutocomplete = ({ 
  selectedSkills, 
  onAddSkill, 
  onRemoveSkill, 
  skillType = "core",
  category = null,
  placeholder = "Type skill & press Enter",
  className = ""
}) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Fetch skills based on category
  useEffect(() => {
    const fetchSkills = async () => {
      if (category) {
        setLoading(true);
        try {
          const res = await api.get(`/skills/category/${encodeURIComponent(category)}`);
          const skills = skillType === "core" ? res.data.coreSkills : res.data.additionalSkills;
          setAllSkills(skills);
        } catch (err) {
          console.error("Failed to fetch skills:", err);
          setAllSkills([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSkills();
  }, [category, skillType]);

  // Filter suggestions based on input
  useEffect(() => {
    if (input.trim()) {
      const filtered = allSkills.filter(skill => 
        skill.toLowerCase().includes(input.toLowerCase().trim()) &&
        !selectedSkills.includes(skill)
      );
      setSuggestions(filtered.slice(0, 10)); // Show max 10 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, allSkills, selectedSkills]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        // Select first suggestion if available
        handleSelectSkill(suggestions[0]);
      } else if (input.trim()) {
        // Add custom skill if no suggestions
        handleAddCustomSkill();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      // Could implement arrow key navigation here
    }
  };

  const handleAddCustomSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      onAddSkill(trimmed);
      setInput("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSkill = (skill) => {
    onAddSkill(skill);
    setInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const skillColorClass = skillType === "core" 
    ? "bg-red-50 text-red-700" 
    : "bg-primary-50 text-primary-700";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[46px] focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 bg-white">
        {selectedSkills.map((skill) => (
          <span 
            key={skill} 
            className={`inline-flex items-center gap-1 ${skillColorClass} px-2.5 py-1 rounded-md text-sm font-medium`}
          >
            {skill}
            <button 
              type="button"
              onClick={() => onRemoveSkill(skill)}
              className={skillType === "core" ? "text-red-400 hover:text-red-600" : "text-primary-400 hover:text-primary-600"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <div className="flex-1 min-w-[120px] relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => input.trim() && setShowSuggestions(true)}
            className="w-full outline-none text-sm bg-transparent"
            placeholder={selectedSkills.length === 0 ? placeholder : "Add more..."}
            disabled={loading}
          />
        </div>
        <button
          type="button"
          onClick={handleAddCustomSkill}
          className="text-gray-400 hover:text-primary-600"
          disabled={!input.trim() || loading}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => handleSelectSkill(skill)}
              className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700 select-none"
            >
              {skill}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default SkillsAutocomplete;

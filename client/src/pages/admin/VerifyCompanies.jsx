import React, { useState, useEffect } from "react";
import { Loader2, ShieldCheck, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";

const VerifyCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/companies/pending");
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error("Failed to fetch pending companies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/admin/companies/${id}/verify`);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setActionId(null);
    }
  };

  const handleUnverify = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/admin/companies/${id}/unverify`);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Unverify failed", err);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verify Employers</h1>
        <p className="text-gray-500 mt-1">
          Review and approve company profiles before they can post internships.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center shadow-sm">
          <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <p className="text-gray-900 font-medium">All caught up!</p>
          <p className="text-gray-500 text-sm mt-1">
            No employers are currently pending verification.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Industry</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Completion</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companies.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">
                            {company.companyName?.charAt(0) || "?"}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{company.companyName}</p>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary-600 hover:underline"
                            >
                              {company.website.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{company.industry || "—"}</td>
                    <td className="px-5 py-4 text-gray-700">{company.location || "—"}</td>
                    <td className="px-5 py-4 text-gray-700">{company.contactPhone || "—"}</td>
                    <td className="px-5 py-4 text-gray-700">{company.user?.email || company.contactEmail || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> {company.completion}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleUnverify(company._id)}
                          disabled={actionId === company._id}
                        >
                          {actionId === company._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleVerify(company._id)}
                          disabled={actionId === company._id}
                        >
                          {actionId === company._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-4 h-4" />
                          )}
                          Verify
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCompanies;

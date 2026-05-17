import { useState, useEffect } from "react";
import Loading from "../../../components/ui/Loading";
import EmptyState from "../../../components/ui/EmptyState";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { toast } from "react-hot-toast/headless";
import { sponsorshipTypeApi, type SponsorshipType } from "../api/sponsorshipTypeApi";

export default function SponsorshipTypesPage() {
  const [types, setTypes] = useState<SponsorshipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newType, setNewType] = useState({ name: "" });
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      setLoading(true);
      const data = await sponsorshipTypeApi.getAll();
      setTypes(data || []);
    } catch (error) {
      toast.error("Failed to load sponsorship types");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newType.name) {
      toast.error("Please enter name");
      return;
    }

    try {
      await sponsorshipTypeApi.create(newType.name);
      toast.success("Sponsorship type added");
      setNewType({ name: "" });
      setShowForm(false);
      loadTypes();
    } catch (error) {
      toast.error("Failed to add sponsorship type");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!newType.name) {
      toast.error("Please enter name");
      return;
    }

    try {
      await sponsorshipTypeApi.update(id, newType.name);
      toast.success("Sponsorship type updated");
      setNewType({ name: "" });
      setEditingId(null);
      loadTypes();
    } catch (error) {
      toast.error("Failed to update sponsorship type");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await sponsorshipTypeApi.delete(deleteTargetId);
      toast.success("Sponsorship type deleted");
      setDeleteTargetId(null);
      loadTypes();
    } catch (error) {
      toast.error("Failed to delete sponsorship type");
    }
  };

  const handleEdit = (type: SponsorshipType) => {
    setEditingId(type.id);
    setNewType({ name: type.name });
    setShowForm(false);
  };

  const handleCancel = () => {
    setNewType({ name: "" });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Sponsorship Types</h1>

      <div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setNewType({ name: "" }); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          {showForm || editingId ? "Cancel" : "Add New Type"}
        </button>
      </div>

      {(showForm || editingId) && (
        <div className="glass-card p-6">
          <div className="flex gap-4 items-end">
            <div className="form-group flex-1">
              <label>Name</label>
              <input
                value={newType.name}
                onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                placeholder="Enter sponsorship type name"
                className="w-full p-3 border border-slate-300 rounded-lg"
              />
            </div>
            <button
              onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              {editingId ? "Update" : "Add"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {types.length === 0 ? (
        <EmptyState message="No sponsorship types found" />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-600">Name</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Created At</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {types.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-800">{t.name}</td>
                    <td className="p-4 text-slate-600">
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        title="Delete Sponsorship Type"
        message="Are you sure you want to delete this sponsorship type?"
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        variant="danger"
      />
    </div>
  );
}

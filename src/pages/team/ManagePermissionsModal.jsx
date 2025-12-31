import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

// This would typically come from a config file or an API
const AVAILABLE_PERMISSIONS = {
  dashboards: [
    { id: 'main_dashboard', name: 'Main Dashboard' },
    { id: 'rto_dashboard', name: 'RTO Dashboard' },
  ],
  widgets: [
    { id: 'revenue', name: 'Revenue Widget' },
    { id: 'orders', name: 'Orders Widget' },
    { id: 'rto_rate', name: 'RTO Rate Widget' },
    { id: 'roi', name: 'ROI Widget' },
  ],
};

const ManagePermissionsModal = ({ member, isOpen, onClose, onSave }) => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      dashboards: member?.permissions?.dashboards || [],
      widgets: member?.permissions?.widgets || [],
    },
  });

  React.useEffect(() => {
    if (member) {
      reset({
        dashboards: member.permissions?.dashboards || [],
        widgets: member.permissions?.widgets || [],
      });
    }
  }, [member, reset]);

  if (!isOpen || !member) return null;

  const onSubmit = (data) => {
    console.log("Saving permissions:", data);
    onSave(member.id, data);
    toast.success(`Permissions updated for ${member.name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Manage Permissions for {member.name}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Allowed Dashboards</h3>
            <div className="space-y-2">
              {AVAILABLE_PERMISSIONS.dashboards.map((p) => (
                <Controller
                  key={p.id}
                  name="dashboards"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={field.value.includes(p.id)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...field.value, p.id]
                            : field.value.filter((id) => id !== p.id);
                          field.onChange(newValue);
                        }}
                      />
                      <span className="text-slate-700 dark:text-slate-300">{p.name}</span>
                    </label>
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Allowed Widgets</h3>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_PERMISSIONS.widgets.map((p) => (
                <Controller
                  key={p.id}
                  name="widgets"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={field.value.includes(p.id)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...field.value, p.id]
                            : field.value.filter((id) => id !== p.id);
                          field.onChange(newValue);
                        }}
                      />
                       <span className="text-slate-700 dark:text-slate-300">{p.name}</span>
                    </label>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600">
              Save Permissions
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePermissionsModal;

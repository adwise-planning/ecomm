import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, UserPlus, MoreVertical, Edit, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryData } from '../../hooks/useQueryData';
import { api } from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '../../components/ui/Skeleton';
import WidgetError from '../../components/dashboard/WidgetError';
import ManagePermissionsModal from './ManagePermissionsModal';

// A simple dropdown for actions
const ActionDropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-10">
          {children}
        </div>
      )}
    </div>
  );
};

const L3TeamView = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQueryData(['team'], api.getTeam);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { role: 'L4' } });

  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isPermissionsModalOpen, setPermissionsModalOpen] = useState(false);

  const assignableRoles = ["L3", "L4"];

  const handleOptimisticUpdate = (updateFn, successMsg, errorMsg) => {
    const originalData = data;
    const newData = updateFn(originalData);
    queryClient.setQueryData(['team'], newData);

    return (apiPromise) => {
      apiPromise
        .then(() => toast.success(successMsg))
        .catch(err => {
          toast.error(`${errorMsg}: ${err.message}`);
          queryClient.setQueryData(['team'], originalData);
        })
        .finally(() => queryClient.invalidateQueries(['team']));
    };
  };

  const onInvite = (formData) => {
    const optimisticUpdate = handleOptimisticUpdate(
      (currentData) => ({
        ...currentData,
        members: [...currentData.members, { ...formData, id: Date.now(), role: formData.role, permissions: { dashboards: [], widgets: [] } }]
      }),
      `Invitation sent to ${formData.email}`,
      'Failed to send invite'
    );
    optimisticUpdate(api.inviteMember(formData.email, formData.name, formData.role));
    reset({ role: 'L4' });
  };

  const onRoleChange = (memberId, newRole) => {
    const optimisticUpdate = handleOptimisticUpdate(
      (currentData) => ({
        ...currentData,
        members: currentData.members.map(m => m.id === memberId ? { ...m, role: newRole } : m)
      }),
      'Member role updated',
      'Failed to update role'
    );
    optimisticUpdate(api.updateTeamMember(memberId, { role: newRole }));
    setEditingMember(null);
  };

  const onSavePermissions = (memberId, permissions) => {
    const optimisticUpdate = handleOptimisticUpdate(
      (currentData) => ({
        ...currentData,
        members: currentData.members.map(m => m.id === memberId ? { ...m, permissions } : m)
      }),
      'Permissions updated',
      'Failed to update permissions'
    );
    optimisticUpdate(api.updateTeamMember(memberId, { permissions }));
  };

  const onRemove = (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    const optimisticUpdate = handleOptimisticUpdate(
      (currentData) => ({
        ...currentData,
        members: currentData.members.filter(m => m.id !== memberId)
      }),
      'Member removed',
      'Failed to remove member'
    );
    optimisticUpdate(api.deleteTeamMember(memberId));
  };

  const renderTable = () => {
    if (isLoading) return <Skeleton className="h-64" />;
    if (isError) return <WidgetError message={error.message} onRetry={refetch} />;

    const members = data?.members || [];

    return (
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {members.map((m) => (
            <tr key={m.id} className="bg-white dark:bg-slate-800">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900 dark:text-white">{m.name}</div>
                <div className="text-slate-500 text-xs">{m.email}</div>
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                {editingMember === m.id ? (
                  <select defaultValue={m.role} onChange={(e) => onRoleChange(m.id, e.target.value)} className="p-1 border rounded dark:bg-slate-700">
                    {assignableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                ) : (
                  m.role
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <ActionDropdown>
                  <button onClick={() => setEditingMember(m.id)} className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">
                    <Edit size={14} /> Edit Role
                  </button>
                  {m.role === 'L4' && (
                    <button onClick={() => { setSelectedMember(m); setPermissionsModalOpen(true); }} className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">
                      <ShieldCheck size={14} /> Manage Permissions
                    </button>
                  )}
                  <button onClick={() => onRemove(m.id)} className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={14} /> Remove
                  </button>
                </ActionDropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ManagePermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
        member={selectedMember}
        onSave={onSavePermissions}
      />
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Management</h1>
        <p className="text-slate-500 dark:text-slate-400">Invite and manage your team members.</p>
      </div>

      <div className="card dark:bg-slate-800 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <UserPlus size={20} /> Invite New User
        </h3>
        <form onSubmit={handleSubmit(onInvite)} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="w-full">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
            <input {...register('name', { required: true })} className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input {...register('email', { required: true })} className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="john@company.com" />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
            <select {...register('role')} disabled className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-600 dark:border-slate-500 dark:text-slate-300 outline-none cursor-not-allowed">
              <option value="L4">L4 - Read-only User</option>
            </select>
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium transition-colors w-full md:w-auto justify-self-end md:col-start-2">
            Send Invite
          </button>
        </form>
      </div>

      <div className="card dark:bg-slate-800 dark:border-slate-700 overflow-hidden p-0">
        {renderTable()}
      </div>
    </div>
  );
};

export default L3TeamView;

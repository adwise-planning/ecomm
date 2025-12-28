import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const L3TeamView = () => {
  const [members, setMembers] = useState([
    { id: 1, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'L4', status: 'Pending' },
    { id: 2, name: 'Sarah Williams', email: 'sarah.williams@example.com', role: 'L4', status: 'Active' },
  ]);
  const { register, handleSubmit, reset } = useForm();

  const onInvite = (data) => {
    const newMember = {
      id: members.length + 1,
      name: data.name,
      email: data.email,
      role: 'L4',
      status: 'Pending',
    };
    setMembers([...members, newMember]);
    toast.success(`Invitation sent to ${data.email}`);
    reset();
  };

  const removeMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
    toast.success('User removed');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Management</h1>
        <p className="text-slate-500 dark:text-slate-400">Invite and manage your team of L4 (Read-only) users.</p>
      </div>

      <div className="card dark:bg-slate-800 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <UserPlus size={20} /> Invite New L4 User
        </h3>
        <form onSubmit={handleSubmit(onInvite)} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
            <input {...register('name', { required: true })} className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" />
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input {...register('email', { required: true })} className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="john@company.com" />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium transition-colors">
            Send Invite
          </button>
        </form>
      </div>

      <div className="card dark:bg-slate-800 dark:border-slate-700 overflow-hidden p-0">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
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
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{m.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    m.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => removeMember(m.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default L3TeamView;

import React from 'react';
import { Plus } from 'lucide-react';

const mockTeamMembers = [
  { id: '1', name: 'L4 User One', email: 'l4-user1@company.com', role: 'L4' },
  { id: '2', name: 'L4 User Two', email: 'l4-user2@company.com', role: 'L4' },
  { id: '3', name: 'L4 User Three', email: 'l4-user3@company.com', role: 'L4' },
];

const L3TeamView = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-gray-600">Manage your L4 read-only users.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTeamMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {member.role}
                  </span>
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

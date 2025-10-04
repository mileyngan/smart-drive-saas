import React from 'react';

const EnrollmentDetails = ({ enrollment }) => {
    if (!enrollment) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Enrollment Details</h2>
                <p>This student is not yet enrolled in a program.</p>
            </div>
        );
    }

    const { program, payments } = enrollment;
    const totalPaid = payments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
    const remainingBalance = parseFloat(program.price) - totalPaid;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Enrollment & Payment Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div>
                    <p className="text-gray-500">Program</p>
                    <p className="font-medium text-gray-800">{program.name}</p>
                </div>
                <div>
                    <p className="text-gray-500">Program Fee</p>
                    <p className="font-medium text-gray-800">{new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(program.price)}</p>
                </div>
                <div>
                    <p className="text-gray-500">Total Paid</p>
                    <p className="font-medium text-green-600">{new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(totalPaid)}</p>
                </div>
                <div>
                    <p className="text-gray-500">Remaining Balance</p>
                    <p className={`font-medium ${remainingBalance > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        {new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(remainingBalance)}
                    </p>
                </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Payment History</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.length > 0 ? (
                            payments.map(payment => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(payment.payment_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(payment.amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{payment.payment_method.replace('_', ' ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.notes}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No payments have been logged yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnrollmentDetails;
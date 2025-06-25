import React from 'react';

const Careers = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Careers</h1>
            <p>
                We're looking for passionate individuals to join our mission. Whether you're a technician,
                customer support rep, or a backend developer — we welcome you to grow with us.
            </p>

            <h2 className="text-xl mt-6 mb-2">Current Openings</h2>
            <ul className="list-disc list-inside">
                <li>Field Technician - Tamil Nadu (Full-time)</li>
                <li>Customer Support Executive - Remote</li>
                <li>React Frontend Developer - Chennai</li>
            </ul>

            <p className="mt-4">Email your CV to <strong>careers@yourdomain.com</strong></p>
        </div>
    );
};

export default Careers;
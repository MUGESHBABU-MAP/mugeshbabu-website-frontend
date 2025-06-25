import React from 'react';

const Press = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Press & Media</h1>
            <p>
                For press inquiries, partnerships, or interviews, please reach out to
                <strong> media@yourdomain.com</strong>.
            </p>

            <h2 className="text-xl mt-6 mb-2">Recent Mentions</h2>
            <ul className="list-disc list-inside">
                <li>📺 The Hindu – Rural Tech Empowerment 2025</li>
                <li>📰 Times Tech – “How Internet is Changing Villages”</li>
                <li>📻 All India Radio Interview – March 2025</li>
            </ul>
        </div>
    );
};

export default Press;
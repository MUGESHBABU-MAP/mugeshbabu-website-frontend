const FAQ = () => {
    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold">Is cable service available in my village?</h3>
                    <p className="text-gray-700">Yes, we operate in over 300+ villages. Contact support to confirm availability in your area.</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">What if my signal is weak?</h3>
                    <p className="text-gray-700">Weak signals can be caused by faulty cables or splitters. We recommend a technician visit for inspection.</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Do you support HD or 4K channels?</h3>
                    <p className="text-gray-700">Yes. Our premium packages include HD and 4K support where infrastructure allows.</p>
                </div>
            </div>
        </div>
    )
}

export default FAQ
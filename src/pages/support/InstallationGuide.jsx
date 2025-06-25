const InstallationGuide = () => {
    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-bold mb-4">Installation Guide</h1>
            <p className="text-gray-700 mb-6">
                This step-by-step guide will help you understand how cable installation works, especially for village homes.
            </p>
            <ol className="list-decimal list-inside space-y-2">
                <li>Technician visits your home for signal check.</li>
                <li>Wiring is laid from nearest junction box.</li>
                <li>Set-top box is installed and configured.</li>
                <li>Demo of basic operations is given to family members.</li>
                <li>Service is activated within 1-2 hours post-installation.</li>
            </ol>
        </div>
    )
}

export default InstallationGuide
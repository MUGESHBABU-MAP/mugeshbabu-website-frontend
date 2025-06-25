const ServiceStatus = () => {
    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-bold mb-4">Service Status</h1>
            <p className="text-gray-700 mb-6">
                Here you can find current updates on any outages or maintenance work in your area.
            </p>
            <div className="hidden bg-yellow-100 text-yellow-800 p-4 rounded">
                <strong>Update:</strong> Maintenance scheduled on <b>June 28</b> for <i>Thiruvannamalai</i> region. Expect interruptions between 2 PM to 5 PM.
            </div>
            <div className="bg-green-100 text-green-800 p-4 rounded">
                <strong>All systems operational!</strong> No outages reported in your area.
            </div>
        </div>
    )
}

export default ServiceStatus
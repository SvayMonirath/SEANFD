import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 min-h-screen">
      {/* Navbar */}
      <nav className="flex flex-row p-6 bg-slate-900 justify-between items-center flex-wrap">
        <div className="text-white font-bold text-xl md:text-3xl lg:text-4xl flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-600 inline-block mr-2"
          >
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          <span>SEANFD</span>
        </div>

        <div className="flex flex-row space-x-2 md:space-x-6 items-center mt-2 md:mt-0 flex-wrap justify-center w-full md:w-auto">
          <Link
            to="/"
            className="!text-white text-xl px-6 py-3 bg-slate-600/50 rounded-md font-medium hover:bg-slate-700 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/Graph"
            className="!text-white text-xl px-3 py-2 rounded-md font-medium hover:bg-slate-700 transition duration-200"
          >
            Network Graph
          </Link>
          <Link
            to="/Settings"
            className="!text-white text-xl px-3 py-2 rounded-md font-medium hover:bg-slate-700 transition duration-200"
          >
            Settings
          </Link>
        </div>
        <div className="flex flex-row justify-end mt-2 md:mt-0 w-full md:w-auto">
          <button className="px-6 py-3 !bg-cyan-800 opacity-35 !cursor-not-allowed text-white !font-bold !text-lg ">
            Export Data
          </button>
        </div>
      </nav>

      {/* Main Section */}
      <section className="flex flex-col py-20 px-6 gap-20">
        {/* Section 1: Hero + Graph */}
        <div className="flex flex-col lg:flex-row w-full justify-center items-center gap-20">
          {/* Left Side: Hero Text */}
          <div className="text-white flex flex-col gap-4 max-w-lg">
            <div className="text-5xl md:text-6xl lg:text-7xl font-medium flex flex-col gap-2">
              <div>Southeast</div>
              <div>Asia</div>
              <div>Network</div>
              <div>Flow</div>
              <div>Dashboard</div>
            </div>

            <p className="text-xl text-gray-400 mt-4">
              Real-Time visualization of trend propagation, influence networks,
              and information flow across Southeast Asia
            </p>

            {/* Selects */}
            <div className="flex flex-col md:flex-row gap-8 mt-6">
              <div className="flex flex-col text-lg">
                <label className="text-white mb-2">Select Country:</label>
                <select className="bg-slate-800 border-2 border-slate-700 text-white p-2 rounded-md">
                  <option>All Countries</option>
                  <option>Indonesia</option>
                  <option>Malaysia</option>
                  <option>Philippines</option>
                  <option>Singapore</option>
                  <option>Thailand</option>
                  <option>Vietnam</option>
                  <option>Cambodia</option>
                </select>
              </div>
              <div className="flex flex-col text-lg">
                <label className="text-white mb-2">Select Event:</label>
                <select className="bg-slate-800 border-2 border-slate-700 text-white p-2 rounded-md">
                  <option>General Election</option>
                  <option>Natural Disaster</option>
                  <option>Sports Event</option>
                  <option>Cultural Festival</option>
                </select>
              </div>
            </div>

            {/* Launch Button */}
            <button className="mt-6 !bg-blue-800/50 text-white font-bold !py-4 !px-10 rounded-2xl text-base !w-1/2 md:w-auto !cursor-not-allowed transition-transform duration-300 ease-in-out">
              Launch Live Dashboard
            </button>
          </div>

          {/* Right Side: Graph */}
          <div className="flex flex-col gap-6 justify-center w-full max-w-md">
            <div className="bg-gray-800 border-2 border-slate-600 rounded-3xl p-4">
              <svg className="w-full h-96" viewBox="0 0 400 300">
                {/* Lines */}
                {[
                  { x1: 100, y1: 80, x2: 200, y2: 150 },
                  { x1: 100, y1: 80, x2: 300, y2: 100 },
                  { x1: 200, y1: 150, x2: 300, y2: 100 },
                  { x1: 200, y1: 150, x2: 200, y2: 250 },
                  { x1: 300, y1: 100, x2: 350, y2: 180 },
                ].map((line, idx) => (
                  <line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                ))}

                {/* Nodes */}
                {[
                  { cx: 100, cy: 80, label: "KH" },
                  { cx: 200, cy: 150, label: "VN" },
                  { cx: 300, cy: 100, label: "PP" },
                  { cx: 200, cy: 250, label: "IN" },
                  { cx: 350, cy: 180, label: "SG" },
                ].map((node, idx) => (
                  <g key={idx}>
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="25"
                      fill="#444f69"
                      stroke="white"
                    />
                    <text
                      x={node.cx}
                      y={node.cy - 30}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="bg-gray-800 border-2 border-slate-600 px-6 py-3 rounded-xl font-medium flex flex-row items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
              <span>Live Data Stream Active</span>
            </div>
          </div>
        </div>

        {/* Section 2: Title */}
        <div className="p-6 flex flex-col justify-center items-center w-full gap-4 lg:mt-20">
          <h2 className="text-white !text-4xl font-medium md:!text-5xl lg:!text-6xl">
            Real-Time Analytics Overview
          </h2>
          <p className="text-white mt-2 !text-base !text-lg">
            Live metrics tracking information flow across the regions
          </p>
        </div>

        {/* Section 2: Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center items-center  w-full px-6">
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-activity-icon lucide-activity mb-4 text-white"
                >
                  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                </svg>
              ),
              label: "Top influencer Nodes",
              value: "Singapore",
              detail: "Centrality score: 0.87",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-clock8-icon lucide-clock-8 mb-4 text-white"
                >
                  <path d="M12 6v6l-4 2" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              ),
              label: "Avg. Trend Arrival",
              value: "2.4 hrs",
              detail: "24h Average",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-zap-icon lucide-zap mb-5 text-white"
                >
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
              ),
              label: "Fastest Spread Path",
              value: "SG -> MY -> VN",
              detail: "24h Average",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-cable-icon lucide-cable text-white mb-4"
                >
                  <path d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z" />
                  <path d="M17 21v-2" />
                  <path d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10" />
                  <path d="M21 21v-2" />
                  <path d="M3 5V3" />
                  <path d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z" />
                  <path d="M7 5V3" />
                </svg>
              ),
              label: "Active Connection",
              value: "247",
              detail: "+12% from yesterday",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-database-icon lucide-database mb-4 text-white"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                  <path d="M3 12A9 3 0 0 0 21 12" />
                </svg>
              ),
              label: "Data Volume",
              value: "15.7K",
              detail: "Last 24hrs",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-layers-icon lucide-layers mb-4 text-white"
                >
                  <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
                  <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
                  <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
                </svg>
              ),
              label: "Update Frequently",
              value: "Real-Time",
              detail: "5 sec intervals",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-gray-800 border-2 border-slate-600 rounded-2xl p-8 m-4 flex flex-col"
            >
              {card.icon}
              <p className="text-gray-400 font-semibold">{card.label}</p>
              <h3 className="text-white text-3xl lg:!text-5xl font-semibold mb-4">
                {card.value}
              </h3>
              <p className="text-gray-400 font-semibold">{card.detail}</p>
            </div>
          ))}
        </div>

        {/* Section 3: Title */}
        <div className="p-6 flex flex-col justify-center items-center w-full gap-4 mt-20">
          <h2 className="text-white !text-4xl font-medium md:!text-5xl lg:!text-6xl">
            Interactive Graph Compatibilities
          </h2>
          <p className="text-white mt-2 !text-base !text-lg">
            Explore the network graph with various interactive features
          </p>
        </div>

        {/* Section 3: Content */}
        <div className="flex flex-col lg:flex-row w-full justify-center items-start">
          {/* Graph Illustration */}
          <div className="bg-gray-800 border-2 border-slate-600 rounded-xl p-10 m-6 h-auto">
            <svg className="w-full min-h-[400px]" viewBox="0 0 400 350">
              {/* Lines - Triangle/Diamond pattern */}
              {[
                { x1: 200, y1: 50, x2: 100, y2: 200 },
                { x1: 200, y1: 50, x2: 300, y2: 200 },
                { x1: 100, y1: 200, x2: 300, y2: 200 },
                { x1: 100, y1: 200, x2: 200, y2: 280 },
                { x1: 300, y1: 200, x2: 200, y2: 280 },
              ].map((line, idx) => (
                <line
                  key={idx}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#475569"
                  strokeWidth="2"
                />
              ))}

              {/* Nodes */}
              {[
                { cx: 200, cy: 50, label: "KH" },
                { cx: 100, cy: 200, label: "VN" },
                { cx: 300, cy: 200, label: "PP" },
                { cx: 200, cy: 280, label: "IN" },
                { cx: 150, cy: 120, label: "SG" },
              ].map((node, idx) => (
                <g key={idx}>
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="25"
                    fill="#444f69"
                    stroke="white"
                  />
                  <text
                    x={node.cx}
                    y={node.cy - 30}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* interactive features */}
          <div className="flex flex-col max-w-xl !py-12 px-10 gap-6 bg-black/30 border-2 border-slate-600 rounded-xl m-6">
            <div className="flex flex-row gap-4 items-center text-white font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-tornado-icon lucide-tornado"
              >
                <path d="M21 4H3" />
                <path d="M18 8H6" />
                <path d="M19 12H9" />
                <path d="M16 16h-6" />
                <path d="M11 20H9" />
              </svg>
              <span className="font-bold text-xl">Interactive Features</span>
            </div>
            {/* checkbox */}
            <div className="flex flex-col gap-4 text-white">
              {[
                "Social Media",
                "Internet",
                "Tourism",
                "Trade",
                "Historical",
              ].map((feature, idx) => (
                <label key={idx} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-blue-600/40"
                    checked
                    readOnly
                  />
                  <span className="text-lg font-medium">{feature}</span>
                </label>
              ))}
              <button className="mt-4 mb-5 px-4 py-2 !bg-blue-600 text-white rounded hover:opacity-60">
                Apply Filter
              </button>
              <h1 className="!text-3xl font-bold">Smart Filter</h1>
              <p className="text-gray-400 mb-8">
                Automatically highlight key nodes and connections based on
                selected criteria to enhance data interpretation.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "Cambodia",
                  "Vietnam",
                  "Philippines",
                  "Singapore",
                  "Indonesia",
                  "Malaysia",
                ].map((country, idx) => (
                  <button
                    key={idx}
                    className="border !border-gray-600 rounded px-3 py-1"
                  >
                    {country}
                  </button>
                ))}
              </div>
              <h1 className="!text-3xl font-bold mt-5">Country Selection</h1>
              <p className="text-gray-400 mb-8">
                Centralize your view by selecting specific countries to focus on
                their network interactions.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Title */}
        <div className="p-6 flex flex-col justify-center items-center w-full gap-4 mt-20">
          <h2 className="text-white !text-4xl font-medium md:!text-5xl lg:!text-6xl">
            How It Works
          </h2>
          <p className="text-white mt-2 !text-base !text-lg">
            An overview of the data collection and visualization process
          </p>
        </div>

        {/* Section 4: Content */}
        <div className="flex flex-col gap-20 w-full">
          {/* Data Ingestion */}
          <div className="flex flex-col lg:flex-row w-full justify-center items-center gap-12">
            <div className="flex flex-col max-w-xl gap-6">
              <h3 className="text-white text-3xl font-bold">Data Ingestion</h3>
              <p className="text-gray-400 text-lg">
                We collect real-time data from multiple sources across Southeast
                Asia including social media platforms, news outlets, and network
                sensors. The data is normalized and processed to ensure
                consistency and accuracy before being fed into our analysis
                pipeline.
              </p>
              <div className="flex flex-col gap-3">
                {["Social Media APIs", "News Feeds", "Network Sensors"].map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-white"
                    >
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-gray-800 border-2 border-slate-600 rounded-xl p-8 flex-shrink-0">
              <svg className="w-80 h-80" viewBox="0 0 300 300">
                {/* Data sources */}
                {[
                  { cx: 50, cy: 75, label: "Twitter" },
                  { cx: 50, cy: 150, label: "News" },
                  { cx: 50, cy: 225, label: "Market" },
                ].map((node, idx) => (
                  <g key={idx}>
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="20"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={node.cx}
                      y={node.cy + 35}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
                {/* Arrows to center */}
                {[75, 150, 225].map((cy, idx) => (
                  <line
                    key={idx}
                    x1="75"
                    y1={cy}
                    x2="150"
                    y2={cy}
                    stroke="#475569"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                ))}
                {/* Processing center */}
                <circle
                  cx="200"
                  cy="150"
                  r="35"
                  fill="#1e293b"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <text
                  x="200"
                  y="155"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Process
                </text>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#475569" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>

          {/* Graph Construction */}
          <div className="flex flex-col lg:flex-row-reverse w-full justify-center items-center gap-12">
            <div className="flex flex-col max-w-xl gap-6">
              <h3 className="text-white text-3xl font-bold">
                Graph Construction
              </h3>
              <p className="text-gray-400 text-lg">
                The processed data is transformed into a dynamic network graph
                where nodes represent countries and regions, while edges
                represent information flow connections. Weights and directions
                are calculated based on interaction frequency and influence
                patterns.
              </p>
              <div className="flex flex-col gap-3">
                {["Node Creation", "Edge Mapping", "Weight Calculation"].map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-white"
                    >
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-gray-800 border-2 border-slate-600 rounded-xl p-8 flex-shrink-0">
              <svg className="w-80 h-80" viewBox="0 0 300 300">
                {/* Network nodes */}
                {[
                  { cx: 100, cy: 75, label: "KH" },
                  { cx: 200, cy: 75, label: "VN" },
                  { cx: 150, cy: 180, label: "SG" },
                  { cx: 75, cy: 180, label: "IN" },
                  { cx: 225, cy: 180, label: "PP" },
                ].map((node, idx) => (
                  <g key={idx}>
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="22"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={node.cx}
                      y={node.cy + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
                {/* Connections */}
                {[
                  { x1: 100, y1: 75, x2: 200, y2: 75 },
                  { x1: 100, y1: 75, x2: 150, y2: 180 },
                  { x1: 200, y1: 75, x2: 150, y2: 180 },
                  { x1: 150, y1: 180, x2: 75, y2: 180 },
                  { x1: 150, y1: 180, x2: 225, y2: 180 },
                ].map((line, idx) => (
                  <line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Real-Time Propagation */}
          <div className="flex flex-col lg:flex-row w-full justify-center items-center gap-12">
            <div className="flex flex-col max-w-xl gap-6">
              <h3 className="text-white text-3xl font-bold">
                Real-Time Propagation
              </h3>
              <p className="text-gray-400 text-lg">
                As new data arrives, the system updates the graph in real-time,
                highlighting active propagation paths and trending information
                flows. Algorithms detect patterns and predict potential
                influence trajectories across the network within seconds.
              </p>
              <div className="flex flex-col gap-3">
                {["Live Updates", "Path Detection", "Trend Prediction"].map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-white"
                    >
                      <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-gray-800 border-2 border-slate-600 rounded-xl p-8 flex-shrink-0">
              <svg className="w-80 h-80" viewBox="0 0 300 300">
                {/* Base network */}
                {[
                  { cx: 100, cy: 100, label: "Start" },
                  { cx: 200, cy: 100, label: "Node2" },
                  { cx: 150, cy: 220, label: "End" },
                ].map((node, idx) => (
                  <g key={idx}>
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="22"
                      fill={idx === 0 ? "#a855f7" : "#a855f7"}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={node.cx}
                      y={node.cy + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
                {/* Propagation paths with animation indicators */}
                <line
                  x1="100"
                  y1="100"
                  x2="200"
                  y2="100"
                  stroke="#a855f7"
                  strokeWidth="3"
                  opacity="0.8"
                />
                <line
                  x1="200"
                  y1="100"
                  x2="150"
                  y2="220"
                  stroke="#a855f7"
                  strokeWidth="3"
                  opacity="0.6"
                />
                {/* Pulse circles */}
              </svg>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="bg-slate-900 text-white text-center p-6 mt-20">
          &copy; 2024 SEANFD. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

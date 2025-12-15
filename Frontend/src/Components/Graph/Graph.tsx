import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import cose from "cytoscape-cose-bilkent";

Cytoscape.use(cose);

const BACKEND_URL = "http://localhost:5001";

// Types
interface GraphProps {
  eventTitle: string;
  origin: string;
  activeFactors: { [key: string]: boolean };
}

export const Graph = () => {
  // State Variables
  const [events, setEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [activeFactors, setActiveFactors] = useState<{
    [key: string]: boolean;
  }>({
    social: true,
    internet: true,
    trade: true,
    tourism: true,
    historical: true,
  });

  const [reciprocalData, setReciprocalData] = useState<any>(null);
  const [degreeData, setDegreeData] = useState<any>(null);
  const [nodes, setNodes] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [shortestPathData, setShortestPathData] = useState<string[]>([]);

  const cyRef = useRef<any>(null);

  // Fetch Events and Countries on Mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/data/get_events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events);
        } else {
          setMessage("Failed to fetch events");
          setStatus("error");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/data/get_countries`);
        if (res.ok) {
          const data = await res.json();
          setCountries(data.countries);
        } else {
          setMessage("Failed to fetch countries");
          setStatus("error");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCountries();
    fetchEvents();
  }, []);

  // Generate Graph Handler
  const handleGenerateGraph = async () => {
    const graphRequest: GraphProps = {
      eventTitle: selectedEvent,
      origin: selectedCountry,
      activeFactors,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/graph/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphRequest),
      });

      if (res.ok) {
        const Data = await res.json();
        setData(Data.graph);
        // node cant be selectedcountry
        setNodes(
          Data.graph.nodes.filter((node: string) => node !== selectedCountry)
        );
        setMessage(Data.message);
        setStatus(Data.status);
        console.log("Graph data:", Data.graph);
      } else {
        setMessage("Failed to generate graph");
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleShortestPath = async () => {
    if (!selectedPath || !selectedCountry) {
      alert("Please select a target country and make sure origin is selected.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/graph/shortest_path`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes: data.nodes, // graph nodes
          edges: data.edges, // graph edges
          origin: selectedCountry, // origin country
          target: selectedPath, // selected target
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setShortestPathData(result.path || []);
        setMessage(result.message || "Shortest path calculated");
        setStatus(result.status || "success");
        highlightPath(result.path || [], result.edges || []); // pass both nodes & edges
        console.log("Shortest path data:", result.path);
        console.log("Edges along path:", result.edges);
      } else {
        const err = await res.json();
        alert(err.detail || "Error calculating shortest path");
      }
    } catch (error) {
      console.error("Error fetching shortest path:", error);
    }
  };

  // Auto-clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setStatus("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Graph Elements and Styles
  const cytoscapeElements = data
    ? [
        ...data.nodes.map((n: string) => ({
          data: { id: n, label: n },
          classes: selectedCountry === n ? "origin" : "",
        })),
        ...data.edges.map((e: any) => ({
          data: {
            id: `${e.from}-${e.to}`, // unique edge ID
            source: e.from,
            target: e.to,
            weight: e.weight,
          },
        })),
      ]
    : [];

  const highlightPath = (nodes: string[], edges: any[]) => {
    if (!cyRef.current) return;

    const cy = cyRef.current;

    cy.elements().removeClass("highlighted-node highlighted-edge");

    nodes.forEach((nodeId) => {
      const node = cy.getElementById(nodeId);
      if (node) node.addClass("highlighted-node");
    });

    edges.forEach((e) => {
      const edge = cy.getElementById(`${e.from}-${e.to}`);
      if (edge) edge.addClass("highlighted-edge");
    });
  };

  //------------------------- ANALYSIS COMPONENT RENDERING -------------------------//
  useEffect(() => {
    const reciprocityAnalysis = async () => {
      if (!data) return;
      try {
        const analysisRequest = {
          nodes: data.nodes,
          edges: data.edges,
        };

        const res = await fetch(`${BACKEND_URL}/analysis/reciprocity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(analysisRequest),
        });

        if (res.ok) {
          const analysisData = await res.json();
          console.log("Reciprocity Analysis:", analysisData);
          setReciprocalData(analysisData.reciprocity);
        } else {
          console.error("Failed to perform reciprocity analysis");
        }
      } catch (error) {
        console.error("Reciprocity analysis error:", error);
      }
    };

    const degreeAnalysis = async () => {
      if (!data) return;
      try {
        const analysisRequest = {
          nodes: data.nodes,
          edges: data.edges,
        };

        const res = await fetch(`${BACKEND_URL}/analysis/degree`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(analysisRequest),
        });

        if (res.ok) {
          const analysisData = await res.json();
          console.log("Degree Analysis:", analysisData.degree_analysis);
          setDegreeData(analysisData.degree_analysis);
        } else {
          console.error("Failed to perform degree analysis");
        }
      } catch (error) {
        console.error("Degree analysis error:", error);
      }
    };

    reciprocityAnalysis();
    degreeAnalysis();
  }, [data]);

  // ------------------- Rendering --------------- //
  return (
    <div className="min-h-screen w-full bg-white">
      {message && (
        <div
          className={`fixed top-32 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg font-semibold text-center animate-fade-in-out shadow-lg ${
            status === "error"
              ? "bg-red-500/10 border border-red-500 text-red-600"
              : status === "warning"
              ? "bg-yellow-500/10 border border-yellow-500 text-yellow-600"
              : status === "success"
              ? "bg-green-500/10 border border-green-500 text-green-600"
              : "opacity-0"
          }`}
        >
          {message}
        </div>
      )}

      {/* Navbar */}
      <nav className="flex flex-row p-4 md:p-6 bg-slate-900 justify-between items-center flex-wrap">
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
            className="!text-white text-xl px-3 py-2 rounded-md font-medium hover:bg-slate-700 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/Graph"
            className="!text-white text-xl bg-slate-600/50 px-6 py-3 rounded-md font-medium hover:bg-slate-700 transition duration-200"
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
          <button
            // if no data, no reciprocal data, no degree data then button must not be clickable
            className={`
              text-white !px-6 !py-3 rounded-md !text-lg !font-bold  transition duration-200
                ${data && reciprocalData && degreeData ? "cursor-pointer !bg-cyan-800 hover:!bg-cyan-700" : "!cursor-not-allowed !bg-cyan-800 !opacity-35"}
              `}
            disabled={!(data && reciprocalData && degreeData)}
          >
            Export Data
          </button>
        </div>
      </nav>

      <div className="flex flex-row ">
        <aside className="w-1/6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col gap-8 p-6 text-white overflow-y-auto border-r border-cyan-500/20 shadow-2xl">
          {/* Event Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Event
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 hover:border-cyan-500/60 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 px-4 py-2.5 rounded-lg text-white text-sm transition-all outline-none"
            >
              <option value="">Choose event...</option>
              {events.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Factors */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Factors
            </label>
            <div className="space-y-2">
              {Object.keys(activeFactors).map((factor) => (
                <label
                  key={factor}
                  className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-cyan-600 transition duration-200"
                >
                  <input
                    type="checkbox"
                    checked={activeFactors[factor]}
                    onChange={() =>
                      setActiveFactors((prev) => ({
                        ...prev,
                        [factor]: !prev[factor],
                      }))
                    }
                    className="w-5 h-5 rounded-lg border-2 border-cyan-500 accent-cyan-500 cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition capitalize">
                    {factor}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Origin Country */}
          <div className="space-y-3 ">
            <label className="!text-xs !font-bold !text-cyan-400 uppercase tracking-widest">
              Origin
            </label>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-2">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`py-2 px-3 rounded-md text-xs font-medium transition-all ${
                    selectedCountry === country
                      ? "!bg-cyan-600 !text-white"
                      : "!bg-slate-700/60 !text-slate-300 hover:!bg-slate-600 hover:!text-white"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateGraph}
            disabled={!selectedEvent || !selectedCountry}
            className="w-full py-3 px-4 !bg-cyan-600 hover:!bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg transition-all shadow-lg hover:shadow-cyan-500/40 uppercase tracking-wide"
          >
            Generate
          </button>
        </aside>

        <section
          className="w-5/6 flex flex-col bg-slate-900 min-h-[calc(100vh-72px)]"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), " +
              "linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          }}
        >
          <div className="w-full h-full relative overflow-hidden">
            {cytoscapeElements.length > 0 ? (
              <>
                {/* Info Panel */}
                <div className="absolute top-6 right-6 z-10 bg-slate-800/90 backdrop-blur-md rounded-xl p-5 border border-slate-700 shadow-2xl">
                  <div className="text-cyan-400 text-sm font-bold mb-4 uppercase tracking-wide">
                    Network Info
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Nodes</span>
                      <span className="text-slate-200 font-semibold bg-slate-700 px-3 py-1 rounded">
                        {data.nodes.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Connections</span>
                      <span className="text-slate-200 font-semibold bg-slate-700 px-3 py-1 rounded ml-4">
                        {data.edges.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Origin</span>
                      <span className="text-cyan-400 font-bold bg-slate-700 px-3 py-1 rounded ml-4">
                        {selectedCountry}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Graph */}
                <CytoscapeComponent
                  elements={cytoscapeElements}
                  style={{ width: "100%", height: "100%" }}
                  cy={(cy) => {
                    cyRef.current = cy; // now cyRef.current is the actual Cytoscape instance
                  }}
                  stylesheet={[
                    {
                      selector: "node",
                      style: {
                        "background-color": "#06b6d4",
                        label: "data(label)",
                        "font-size": 18,
                        color: "#ffffff",
                        width: 80,
                        height: 80,
                        "text-valign": "center",
                        "text-halign": "center",
                        "border-width": 3,
                        "border-color": "#0891b2",
                        "box-shadow": "0 0 30px rgba(6, 182, 212, 0.6)",
                        "font-weight": "bold",
                      },
                    },
                    {
                      selector: "node.origin",
                      style: {
                        "background-color": "#10b981",
                        width: 120,
                        height: 120,
                        "font-size": 22,
                        "box-shadow": "0 0 50px rgba(16, 185, 129, 1)",
                        "border-color": "#059669",
                        "border-width": 4,
                      },
                    },
                    {
                      selector: "edge",
                      style: {
                        width: "mapData(weight, 0, 1, 3, 10)",
                        "line-color": "mapData(weight, 0, 1, #6366f1, #8b5cf6)",
                        "target-arrow-color":
                          "mapData(weight, 0, 1, #6366f1, #8b5cf6)",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                        opacity: "mapData(weight, 0, 1, 0.5, 1)",
                        "arrow-scale": 2,
                      },
                    },
                    {
                      selector: ".highlighted-node",
                      style: {
                        "background-color": "#f59e0b",
                        width: 100,
                        height: 100,
                        "font-size": 20,
                        "box-shadow": "0 0 50px rgba(245,158,11,0.8)",
                      },
                    },
                    {
                      selector: ".highlighted-edge",
                      style: {
                        "line-color": "#f59e0b",
                        "target-arrow-color": "#f59e0b",
                        width: 6,
                        "arrow-scale": 2,
                      },
                    },
                  ]}
                  layout={{
                    name: "cose-bilkent",
                    animate: true,
                    animationDuration: 800,
                    nodeSpacing: 800,
                    edgeElasticity: 0.3,
                    nestingFactor: 0.1,
                    gravity: 0.3,
                    idealEdgeLength: 500,
                    numIter: 3000,
                    tile: true,
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-12 h-12 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Generate Network Graph
                  </h2>
                  <p className="text-slate-400 max-w-sm">
                    Select an event and origin country, then click generate to
                    visualize connections
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ANALYSIS SECTION */}
      <div className="w-full text-white bg-slate-900">
        {/* Header */}
        <div className="p-8 border-b border-cyan-500/20 flex justify-center flex-col items-center">
          <h1 className="bg-gradient-to-br from-white to-blue-500 bg-clip-text text-transparent font-medium !text-5xl lg:!text-6xl xl:!text-7xl ">
            Analysis
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Detailed metrics and insights about your network graph
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Shortest Path Analysis */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-cyan-500/30 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-cyan-600/10 to-transparent border-b border-cyan-500/20">
              <h3 className="text-xl font-bold text-cyan-300 uppercase tracking-wide">
                🗺️ Shortest Path Analysis
              </h3>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-end">
                {/* Target Selection */}
                <div className="lg:col-span-2">
                  <label className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-4 block">
                    Select Target Destination
                  </label>
                  <select
                    id="targetCountry"
                    value={selectedPath}
                    onChange={(e) => setSelectedPath(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600/60 hover:border-cyan-500/60 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 px-4 py-3 rounded-lg text-white text-sm transition-all outline-none"
                  >
                    <option value="">-- Select Target Country --</option>
                    {nodes.map((node: string) => (
                      <option key={node} value={node}>
                        {node}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-3">
                    Find the shortest route from{" "}
                    <span className="text-cyan-400 font-semibold">
                      {selectedCountry || "origin"}
                    </span>{" "}
                    to your target
                  </p>
                </div>

                {/* Calculate Button */}
                <div className="flex flex-col justify-end">
                  <button
                    onClick={handleShortestPath}
                    className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-cyan-500/50 uppercase tracking-wide"
                    disabled={!selectedPath || !selectedCountry}
                  >
                    Calculate
                  </button>
                </div>
              </div>

              {/* Path Result */}
              {shortestPathData.length > 0 && (
                <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900/40 p-6 rounded-lg border border-cyan-500/30">
                  <div className="mb-6 flex items-center gap-2">
                    <span className="text-cyan-400 text-lg">✓</span>
                    <p className="text-xs uppercase tracking-widest text-cyan-300 font-bold">
                      Path Successfully Found
                    </p>
                  </div>

                  <div className="overflow-x-auto pb-4">
                    <div className="flex items-center gap-2 min-w-max">
                      {shortestPathData.map((node: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 px-4 py-2 rounded-lg shadow-lg border border-cyan-400/50 min-w-[100px] text-center">
                            <p className="text-white font-semibold text-2xl">
                              {node}
                            </p>
                          </div>
                          {idx < shortestPathData.length - 1 && (
                            <span className="text-cyan-400 font-bold text-lg">
                              →
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        Total Hops
                      </p>
                      <p className="text-3xl font-bold text-cyan-400">
                        {shortestPathData.length - 1}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        Countries Visited
                      </p>
                      <p className="text-3xl font-bold text-emerald-400">
                        {shortestPathData.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!shortestPathData.length && selectedPath && (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">
                    Click "Calculate" to discover the path
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reciprocity Analysis */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-purple-500/30 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-purple-600/10 to-transparent border-b border-purple-500/20">
              <h3 className="text-xl font-bold text-purple-300 uppercase tracking-wide">
                🔄 Reciprocity Analysis
              </h3>
            </div>

            <div className="p-8">
              {reciprocalData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/30 p-6 rounded-lg border border-purple-500/30">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">
                        Reciprocity Rate
                      </p>
                      <p className="text-4xl font-bold text-purple-400">
                        {reciprocalData.reciprocity_percentage || 0}%
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Bidirectional relationships
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/30 p-6 rounded-lg border border-purple-500/30">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">
                        One-Way Edges
                      </p>
                      <p className="text-4xl font-bold text-purple-400">
                        {reciprocalData.one_way_edges?.length || 0}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Unidirectional connections
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* One-Way Edges */}
                    <div>
                      <h4 className="text-sm font-bold text-purple-300 mb-4 uppercase tracking-wide">
                        One-Way Connections
                      </h4>
                      <div className="bg-slate-700/30 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2 border border-slate-600/40">
                        {reciprocalData.one_way_edges?.length > 0 ? (
                          reciprocalData.one_way_edges.map(
                            (
                              edge: {
                                from: string;
                                to: string;
                                weight: number;
                              },
                              idx: number
                            ) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center text-xs p-3 bg-slate-600/20 hover:bg-slate-600/40 rounded transition-colors"
                              >
                                <span className="text-slate-200 font-medium">
                                  {edge.from} → {edge.to}
                                </span>
                                <span className="text-purple-400 font-semibold text-xs bg-purple-950/50 px-2 py-1 rounded">
                                  {edge.weight.toFixed(2)}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-slate-500 text-center py-6">
                            No one-way edges
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Strongest Reciprocal Pairs */}
                    <div>
                      <h4 className="text-sm font-bold text-purple-300 mb-4 uppercase tracking-wide">
                        Strongest Reciprocal Pairs
                      </h4>
                      <div className="bg-slate-700/30 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2 border border-slate-600/40">
                        {reciprocalData.strongest_reciprocal?.length > 0 ? (
                          reciprocalData.strongest_reciprocal.map(
                            (
                              pair: {
                                pair: [string, string];
                                average_weight: number;
                              },
                              idx: number
                            ) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center text-xs p-3 bg-slate-600/20 hover:bg-slate-600/40 rounded transition-colors"
                              >
                                <span className="text-slate-200 font-medium">
                                  {pair.pair[0]} ↔ {pair.pair[1]}
                                </span>
                                <span className="text-purple-400 font-semibold text-xs bg-purple-950/50 px-2 py-1 rounded">
                                  {pair.average_weight.toFixed(2)}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-slate-500 text-center py-6">
                            No reciprocal pairs
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-sm">
                    Generate a graph to view reciprocity analysis
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Degree Analysis */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-emerald-500/30 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-emerald-600/10 to-transparent border-b border-emerald-500/20">
              <h3 className="text-xl font-bold text-emerald-300 uppercase tracking-wide">
                📊 Degree Analysis
              </h3>
            </div>

            <div className="p-8">
              {degreeData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/30 p-6 rounded-lg border border-emerald-500/30">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">
                        Max In-Degree
                      </p>
                      <p className="text-4xl font-bold text-emerald-400">
                        {Math.max(...Object.values(degreeData.in_degree))}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Incoming connections
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/30 p-6 rounded-lg border border-emerald-500/30">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">
                        Max Out-Degree
                      </p>
                      <p className="text-4xl font-bold text-emerald-400">
                        {Math.max(...Object.values(degreeData.out_degree))}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Outgoing connections
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/30 p-6 rounded-lg border border-emerald-500/30">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">
                        Max Total Degree
                      </p>
                      <p className="text-4xl font-bold text-emerald-400">
                        {Math.max(...Object.values(degreeData.total_degree))}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        All connections
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-emerald-300 mb-4 uppercase tracking-wide">
                      Top Nodes by Influence
                    </h4>
                    <div className="bg-slate-700/30 rounded-lg p-4 max-h-64 overflow-y-auto border border-slate-600/40">
                      <div className="space-y-2">
                        {degreeData.sorted_degrees.map(
                          ([node, total_degree], idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-xs p-3 bg-slate-600/20 hover:bg-slate-600/40 rounded transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-emerald-400 font-bold w-6">
                                  #{idx + 1}
                                </span>
                                <span className="text-slate-200 font-medium">
                                  {node}
                                </span>
                              </div>
                              <div className="text-right space-y-1">
                                <p className="text-emerald-400 font-semibold">
                                  Total: {total_degree}
                                </p>
                                <p className="text-slate-400 text-xs">
                                  In: {degreeData.in_degree[node]} | Out:{" "}
                                  {degreeData.out_degree[node]}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-sm">
                    Generate a graph to view degree analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

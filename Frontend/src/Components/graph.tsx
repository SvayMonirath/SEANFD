import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import cose from "cytoscape-cose-bilkent";

Cytoscape.use(cose);

const BACKEND_URL = "http://localhost:5001";

interface GraphProps {
    eventTitle: string;
    origin: string;
    activeFactors: { [key: string]: boolean };
    threshold?: number;
}

export const Graph = () => {
    const [events, setEvents] = useState<string[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string>("");
    const [countries, setCountries] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [data, setData] = useState<any>(null);
    const [message, setMessage] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [activeFactors, setActiveFactors] = useState<{ [key: string]: boolean }>({
        social: true,
        internet: true,
        trade: true,
        tourism: true,
        historical: true,
    });
    const cyRef = useRef<any>(null);

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

    const handleGenerateGraph = async () => {
        const graphRequest: GraphProps = {
            eventTitle: selectedEvent,
            origin: selectedCountry,
            activeFactors,
            threshold: 0.35,
        };

        try {
            const res = await fetch(`${BACKEND_URL}/graph/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(graphRequest),
            });

            if (res.ok) {
                const data = await res.json();
                setData(data.graph);
                setMessage(data.message);
                setStatus(data.status);
                console.log("Graph data:", data.graph);
            } else {
                setMessage("Failed to generate graph");
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
                setStatus("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const cytoscapeElements = data
        ? [
                ...data.nodes.map((n: string) => ({
                    data: { id: n, label: n },
                    classes: selectedCountry === n ? "origin" : "",
                })),
                ...data.edges.map((e: any) => ({
                    data: { source: e.from, target: e.to, weight: e.weight },
                })),
            ]
        : [];

    const cyStyle = [
        {
            selector: "node",
            style: {
                "background-color": "#06b6d4",
                label: "data(label)",
                "font-size": 14,
                color: "#ffffff",
                width: 40,
                height: 40,
                "text-valign": "center",
                "text-halign": "center",
                "border-width": 2,
                "border-color": "#0891b2",
                "box-shadow": "0 0 20px rgba(6, 182, 212, 0.5)",
            },
        },
        {
            selector: "node.origin",
            style: {
                "background-color": "#10b981",
                width: 55,
                height: 55,
                "box-shadow": "0 0 30px rgba(16, 185, 129, 0.8)",
                "border-color": "#059669",
            },
        },
        {
            selector: "edge",
            style: {
                width: "mapData(weight, 0, 1, 2, 6)",
                "line-color": "mapData(weight, 0, 1, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.9))",
                "target-arrow-color": "mapData(weight, 0, 1, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.9))",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
            },
        },
    ];

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

        <nav className="flex flex-row p-6 bg-slate-900 justify-between items-center">
          <div className="text-white! font-bold text-xl md:text-3xl lg:text-4xl flex items-center gap-4 w-1/6">
            <span>SEANFD</span>
          </div>

          <div className="flex flex-row space-x-6 items-center w-4/6 justify-center">
            <Link
              to="/"
              className="text-white! text-xl px-3 py-2 rounded-md font-medium hover:bg-slate-700 transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/Graph"
              className="text-white! text-xl bg-slate-600/50 px-6 py-3 rounded-md font-medium hover:bg-slate-700 transition duration-200"
            >
              Network Graph
            </Link>
            <Link
              to="/Settings"
              className="text-white! text-xl px-3 py-2 rounded-md font-medium hover:bg-slate-700 transition duration-200"
            >
              Settings
            </Link>
          </div>

        <div className="flex flex-row w-1/6 justify-end">
            {/* export only if there is data */}
            <button className={`px-6 py-3 !bg-green-800 text-white !font-bold !text-lg rounded-md hover:!bg-green-700 transition duration-200 ${!data ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!data}
            >
            Export Data
            </button>
        </div>

        </nav>

        <div className="flex flex-row min-h-[calc(100vh-72px)]">
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
                  <option key={event} value={event}>{event}</option>
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
                  <label key={factor} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeFactors[factor]}
                      onChange={() => setActiveFactors((prev) => ({ ...prev, [factor]: !prev[factor] }))}
                      className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-300 group-hover:text-cyan-300 transition capitalize">
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

          <section className="w-5/6 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
                        <span className="text-slate-200 font-semibold bg-slate-700 px-3 py-1 rounded">{data.nodes.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Connections</span>
                        <span className="text-slate-200 font-semibold bg-slate-700 px-3 py-1 rounded">{data.edges.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Origin</span>
                        <span className="text-cyan-400 font-bold bg-slate-700 px-3 py-1 rounded ml-4">{selectedCountry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Graph */}
                  <CytoscapeComponent
                    ref={cyRef}
                    elements={cytoscapeElements}
                    style={{ width: "100%", height: "100%" }}
                    stylesheet={cyStyle}
                    layout={{
                      name: "cose-bilkent",
                      animate: true,
                      animationDuration: 800,
                      nodeSpacing: 250,
                      edgeElasticity: 0.3,
                      nestingFactor: 0.1,
                      gravity: 0.5,
                      idealEdgeLength: 300,
                      numIter: 3000,
                      tile: true,
                    }}
                    wheelSensitivity={0.1}
                    onNodeMouseOver={(evt: any) => {
                      const node = evt.target;
                      node.style({
                        "background-color": "#fbbf24",
                        width: 65,
                        height: 65,
                        "box-shadow": "0 0 40px rgba(251, 191, 36, 0.8)",
                      });
                    }}
                    onNodeMouseOut={(evt: any) => {
                      const node = evt.target;
                      node.style({
                        "background-color": selectedCountry === node.id() ? "#10b981" : "#06b6d4",
                        width: selectedCountry === node.id() ? 80 : 40,
                        height: selectedCountry === node.id() ? 80 : 40,
                        "box-shadow": selectedCountry === node.id() ? "0 0 30px rgba(16, 185, 129, 0.8)" : "0 0 20px rgba(6, 182, 212, 0.5)",
                      });
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Generate Network Graph</h2>
                    <p className="text-slate-400 max-w-sm">Select an event and origin country, then click generate to visualize connections</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
};

import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activePage, setActivePage] = useState("jobs");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  const [applications, setApplications] = useState(() => {
    const savedApplications = localStorage.getItem("freshroute_applications");
    return savedApplications ? JSON.parse(savedApplications) : [];
  });

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "Hyderabad",
    salary: "",
    job_type: "Full-time",
    experience: "Fresher",
    skills_required: "",
    description: "",
    status: "Active",
    source: "Manual",
    external_url: "",
    external_id: "",
    is_external: false,
  });

  const loadJobs = () => {
    setLoading(true);
    setError("");

    fetch("http://127.0.0.1:8000/api/jobs/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        return response.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Backend is not running. Start Django server first.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const importFreshRouteJobs = () => {
    setImporting(true);
    setMessage("");
    setError("");

    fetch("http://127.0.0.1:8000/api/jobs/import/freshroute/", {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Import failed");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(
          `FreshRoute jobs imported: ${data.imported}, duplicates skipped: ${data.skipped_duplicates}`
        );
        setImporting(false);
        loadJobs();
      })
      .catch(() => {
        setError("Failed to import FreshRoute jobs. Check backend server.");
        setImporting(false);
      });
  };

  const handleApply = (job) => {
    if (job.is_external && job.external_url) {
      window.open(job.external_url, "_blank", "noopener,noreferrer");
      return;
    }

    const alreadyApplied = applications.some((app) => app.jobId === job.id);

    if (alreadyApplied) {
      setMessage("You have already applied for this job.");
      return;
    }

    const newApplication = {
      id: Date.now(),
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      appliedDate: new Date().toLocaleDateString(),
      status: "Applied",
    };

    const updatedApplications = [...applications, newApplication];

    setApplications(updatedApplications);
    localStorage.setItem(
      "freshroute_applications",
      JSON.stringify(updatedApplications)
    );

    setMessage("Application submitted successfully!");
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const manualJob = {
      ...formData,
      source: "Manual",
      external_url: "",
      external_id: `manual_${Date.now()}`,
      is_external: false,
      status: "Active",
    };

    fetch("http://127.0.0.1:8000/api/jobs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(manualJob),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to post job");
        }
        return response.json();
      })
      .then(() => {
        setMessage("Manual job posted successfully!");
        setFormData({
          title: "",
          company: "",
          location: "Hyderabad",
          salary: "",
          job_type: "Full-time",
          experience: "Fresher",
          skills_required: "",
          description: "",
          status: "Active",
          source: "Manual",
          external_url: "",
          external_id: "",
          is_external: false,
        });
        loadJobs();
        setActivePage("jobs");
      })
      .catch(() => {
        setError("Failed to post job. Check backend server or form data.");
      });
  };

  const matchesCategory = (job) => {
    if (categoryFilter === "All") return true;

    const text = `${job.title} ${job.skills_required} ${job.description}`.toLowerCase();

    if (categoryFilter === "Python") return text.includes("python");
    if (categoryFilter === "Django") return text.includes("django");
    if (categoryFilter === "SQL") return text.includes("sql");
    if (categoryFilter === "React") return text.includes("react");
    if (categoryFilter === "Frontend") {
      return (
        text.includes("frontend") ||
        text.includes("html") ||
        text.includes("css") ||
        text.includes("javascript")
      );
    }

    return true;
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";
    const skills = job.skills_required || "";
    const location = job.location || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skills.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity =
      cityFilter === "All" ||
      location.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearch && matchesCity && matchesCategory(job);
  });

  const Navbar = () => (
    <nav className="navbar">
      <h2>FreshRoute</h2>

      <div>
        <button
          className="nav-btn"
          onClick={() => {
            setActivePage("jobs");
            setSelectedJob(null);
            setMessage("");
          }}
        >
          Jobs
        </button>

        <button
          className="nav-btn"
          onClick={() => {
            setActivePage("postJob");
            setSelectedJob(null);
            setMessage("");
          }}
        >
          Post Job
        </button>

        <button
          className="nav-btn"
          onClick={() => {
            setActivePage("applications");
            setSelectedJob(null);
            setMessage("");
          }}
        >
          My Applications
        </button>
      </div>
    </nav>
  );

  if (selectedJob) {
    const alreadyApplied = applications.some(
      (app) => app.jobId === selectedJob.id
    );

    return (
      <div className="app">
        <Navbar />

        <section className="details-section">
          <button
            className="back-link"
            onClick={() => {
              setSelectedJob(null);
              setMessage("");
            }}
          >
            ← Back to Jobs
          </button>

          <div className="details-card">
            <h1>{selectedJob.title}</h1>
            <h3>{selectedJob.company}</h3>

            <div className="details-info">
              <span>{selectedJob.location}</span>
              <span>{selectedJob.salary}</span>
              <span>{selectedJob.job_type}</span>
              <span>{selectedJob.experience}</span>
              <span>{selectedJob.status}</span>
              <span>{selectedJob.source || "Manual"}</span>
            </div>

            <h2>Job Description</h2>
            <p>{selectedJob.description}</p>

            <h2>Required Skills</h2>
            <div className="skills">
              {(selectedJob.skills_list || []).map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>

            {message && <p className="success-message">{message}</p>}

            <button
              className="apply-btn"
              disabled={!selectedJob.is_external && alreadyApplied}
              onClick={() => handleApply(selectedJob)}
            >
              {selectedJob.is_external && selectedJob.external_url
                ? "Apply on Source"
                : alreadyApplied
                ? "Already Applied"
                : "Apply Now"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (activePage === "postJob") {
    return (
      <div className="app">
        <Navbar />

        <section className="form-section">
          <div className="form-card">
            <h1>Post Manual Job</h1>
            <p>Add Hyderabad or Bangalore fresher job openings manually.</p>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handlePostJob} className="job-form">
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />

              <select
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
              </select>

              <input
                type="text"
                placeholder="Salary Ex: 3-5 LPA"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                required
              />

              <select
                value={formData.job_type}
                onChange={(e) =>
                  setFormData({ ...formData, job_type: e.target.value })
                }
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Trainee">Trainee</option>
              </select>

              <input
                type="text"
                placeholder="Experience Ex: Fresher / 0-1 years"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Skills Ex: Python, Django, SQL, React"
                value={formData.skills_required}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills_required: e.target.value,
                  })
                }
                required
              />

              <textarea
                placeholder="Job Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              ></textarea>

              <button type="submit">Post Job</button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  if (activePage === "applications") {
    return (
      <div className="app">
        <Navbar />

        <section className="applications-section">
          <h1>My Applications</h1>
          <p>Track jobs you applied to inside FreshRoute.</p>

          {applications.length === 0 ? (
            <p className="no-jobs">No applications yet.</p>
          ) : (
            <div className="application-list">
              {applications.map((app) => (
                <div className="application-card" key={app.id}>
                  <h3>{app.title}</h3>
                  <p>{app.company}</p>
                  <div className="job-info">
                    <span>{app.location}</span>
                    <span>Applied: {app.appliedDate}</span>
                    <span>Status: {app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <section className="hero">
        <h1>Find Entry-Level Tech Jobs in Hyderabad & Bangalore</h1>
        <p>
          FreshRoute helps freshers discover Python, SQL, Django, React, and
          frontend jobs from local job sources.
        </p>
      </section>

      <section className="jobs-section">
        <div className="section-header">
          <div>
            <h2>Latest Fresher Jobs</h2>
            <p>Only Hyderabad and Bangalore entry-level tech jobs.</p>
          </div>

          <button
            className="import-btn"
            onClick={importFreshRouteJobs}
            disabled={importing}
          >
            {importing ? "Importing..." : "Import Local Fresher Jobs"}
          </button>
        </div>

        {message && <p className="success-message">{message}</p>}

        <div className="search-filter-box">
          <input
            type="text"
            placeholder="Search Python, SQL, React, frontend, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="All">All Cities</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Bangalore">Bangalore</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Python">Python</option>
            <option value="Django">Django</option>
            <option value="SQL">SQL</option>
            <option value="React">React</option>
            <option value="Frontend">Frontend</option>
          </select>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <h3>{jobs.length}</h3>
            <p>Total Local Jobs</p>
          </div>
          <div className="stat-card">
            <h3>{jobs.filter((job) => job.location === "Hyderabad").length}</h3>
            <p>Hyderabad Jobs</p>
          </div>
          <div className="stat-card">
            <h3>{jobs.filter((job) => job.location === "Bangalore").length}</h3>
            <p>Bangalore Jobs</p>
          </div>
          <div className="stat-card">
            <h3>{filteredJobs.length}</h3>
            <p>Matching Jobs</p>
          </div>
        </div>

        {loading && <p>Loading jobs...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && filteredJobs.length === 0 && (
          <p className="no-jobs">No matching fresher jobs found.</p>
        )}

        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <div className="job-top">
                <h3>{job.title}</h3>
                <span className="source-badge">{job.source || "Manual"}</span>
              </div>

              <p className="company">{job.company}</p>

              <div className="job-info">
                <span>{job.location}</span>
                <span>{job.salary}</span>
                <span>{job.job_type}</span>
                <span>{job.experience}</span>
              </div>

              <p className="description">{job.description}</p>

              <div className="skills">
                {(job.skills_list || []).map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedJob(job);
                  setMessage("");
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
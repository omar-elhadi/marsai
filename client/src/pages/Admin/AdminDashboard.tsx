import React, { useState, useEffect, useRef } from "react";
import { Mail, Trash2, Edit, UserPlus, Loader2 } from "lucide-react";

export const AdminDashboard = () => {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    lastLogin?: string;
    loginToken?: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "JURY",
  });

  // Logs d'activité — hauteur fixe pour la stabilité visuelle
  const logCounter = useRef(2);
  const [logs, setLogs] = useState([
    {
      id: 1,
      msg: "SYSTÈME MARSAI PRÊT. CONNEXION SÉCURISÉE.",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const addLog = (msg: string) => {
    const newLog = {
      id: logCounter.current++,
      msg: msg.toUpperCase(),
      time: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 3));
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        credentials: "include",
      });
      const data = await response.json();
      setUsers((data as User[]).sort((a, b) => (a.role === "ADMIN" ? -1 : 1)));
      setLoading(false);
    } catch {
      addLog("ERREUR_SYNC : SERVEUR INJOIGNABLE");
      setLoading(false);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingUser ? "PUT" : "POST";
    const url = editingUser
      ? `${import.meta.env.VITE_API_URL}/users/${editingUser.id}`
      : `${import.meta.env.VITE_API_URL}/users`;
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      addLog(
        `${editingUser ? "MODIF" : "CRÉATION"}_NODE : ${formData.firstName}`,
      );
      setIsModalOpen(false);
      fetchUsers();
    }
  };

  const handleDelete = async (user: User) => {
    if (
      !window.confirm(
        `CONFIRMER LA SUPPRESSION DE ${user.firstName.toUpperCase()} ?`,
      )
    )
      return;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (response.ok) {
      addLog(`RÉVOCATION_ACCÈS : ${user.firstName}`);
      fetchUsers();
    }
  };

  const handleSendInvite = async (user: User) => {
    setInviteLoading(user.id);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}/invite`, {
        method: "POST",
        credentials: "include",
      });
      addLog(`INVITATION_TRANSMISE : ${user.email}`);
    } catch {
      addLog(`ERREUR_MAIL : ÉCHEC`);
    } finally {
      setInviteLoading(null);
      fetchUsers();
    }
  };

  const getStatus = (user: User) => {
    if (user.role === "ADMIN")
      return { color: "text-white", bg: "bg-white", label: "SYSTÈME" };
    if (user.lastLogin)
      return { color: "text-indigo-500", bg: "bg-indigo-500", label: "ACTIF" };
    if (user.loginToken)
      return {
        color: "text-emerald-500",
        bg: "bg-emerald-500",
        label: "INVITATION ENVOYÉE",
      };
    return { color: "text-red-600", bg: "bg-red-600", label: "NON INVITÉ" };
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          height: "16rem",
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
        }}
      >
        <Loader2 size={20} className="animate-spin" />
        Chargement...
      </div>
    );

  return (
    <div
      className="animate-fade-in selection:bg-indigo-500"
      style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
    >
      {/* ── Header éditorial ── */}
      <header
        style={{
          marginBottom: "2.5rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              width: "clamp(2rem, 3vw, 3rem)",
              height: "1px",
              background: "var(--color-accent)",
              flexShrink: 0,
            }}
          />
          <span className="label-overline">Administration</span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1.5rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                fontStyle: "italic",
                color: "var(--color-text)",
                lineHeight: 1,
                marginBottom: "1.25rem",
              }}
            >
              Gestion <span style={{ color: "#6366f1" }}>Jury</span>
            </h1>

            {/* Terminal logs */}
            <div
              style={{
                height: "80px",
                fontFamily: "monospace",
                fontSize: "0.625rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: "var(--color-surface)",
                padding: "0.75rem",
                borderLeft: "2px solid #6366f1",
                overflow: "hidden",
              }}
            >
              <p
                className="label-overline"
                style={{
                  color: "#6366f1",
                  marginBottom: "0.25rem",
                }}
              >
                Activité récente
              </p>
              {logs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    fontStyle: "italic",
                    overflow: "hidden",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <span style={{ color: "#6366f1", flexShrink: 0 }}>
                    [{log.time}]
                  </span>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    &gt; {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton Nouveau Jury */}
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                role: "JURY",
              });
              setIsModalOpen(true);
            }}
            className="group w-full lg:w-auto flex items-center justify-center gap-3 rounded-sm font-black transition-all shrink-0"
            style={{
              background: "transparent",
              border: "2px solid #6366f1",
              color: "var(--color-text)",
              padding: "0.75rem 1.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#6366f1";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text)";
            }}
          >
            <UserPlus size={16} strokeWidth={3} style={{ color: "#818cf8" }} />
            <span
              style={{
                fontSize: "0.625rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Nouveau Jury
            </span>
          </button>
        </div>
      </header>

      {/* ── Liste des membres ── */}
      <div className="space-y-2">
        {users.map((user, index) => {
          const status = getStatus(user);
          return (
            <div
              key={user.id}
              className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition-all duration-300"
              style={{
                padding: "1.25rem 1.5rem",
                border: "1px solid transparent",
                background:
                  index % 2 === 0 ? "var(--color-surface)" : "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor =
                  "var(--color-border-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              {/* Identité */}
              <div className="col-span-5 w-full">
                <span
                  style={{
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    textTransform: "uppercase",
                    color: "var(--color-text)",
                  }}
                >
                  {user.firstName}{" "}
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      fontWeight: 400,
                    }}
                  >
                    {user.lastName}
                  </span>
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.bg}`}
                  />
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </span>
                  <span
                    className={`text-[10px] italic font-medium ${status.color} ml-1 uppercase tracking-tighter shrink-0`}
                  >
                    // {status.label}
                  </span>
                </div>
              </div>

              {/* Rôle */}
              <div className="col-span-3 w-full md:text-center flex md:justify-center">
                <span
                  className={`px-4 py-1 text-[10px] font-black tracking-[0.2em] uppercase border ${user.role === "ADMIN" ? "border-red-500/30 text-red-400 bg-red-500/5" : "border-indigo-500/30 text-indigo-400 bg-indigo-500/5"}`}
                >
                  {user.role}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-4 w-full flex flex-row justify-end gap-2 sm:gap-1.5 mt-2 md:mt-0">
                {user.role !== "ADMIN" ? (
                  <>
                    <button
                      onClick={() => handleSendInvite(user)}
                      className="flex-1 md:flex-none flex justify-center items-center p-3 md:p-2.5 hover:bg-emerald-600 hover:text-white transition-all"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {inviteLoading === user.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Mail size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setFormData({
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email,
                          role: user.role,
                        });
                        setIsModalOpen(true);
                      }}
                      className="flex-1 md:flex-none flex justify-center items-center p-3 md:p-2.5 hover:bg-orange-500 hover:text-white transition-all"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="flex-1 md:flex-none flex justify-center items-center p-3 md:p-2.5 hover:bg-red-600 hover:text-white transition-all"
                      style={{
                        background: "var(--color-surface)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "0.625rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "var(--color-text-faint)",
                      padding: "0.5rem",
                      textAlign: "right",
                      width: "100%",
                    }}
                  >
                    SYSTEM_ROOT_ACCESS
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modale création/édition ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 sm:p-6"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setIsModalOpen(false)}
        >
          <form
            onSubmit={handleAction}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--color-bg-pure)",
              border: "1px solid var(--color-border)",
              padding: "clamp(1.5rem, 4vw, 3rem)",
              width: "100%",
              maxWidth: "28rem",
              overflowY: "auto",
              maxHeight: "90vh",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                color: "var(--color-text)",
                marginBottom: "2.5rem",
              }}
            >
              {editingUser ? "Modifier" : "Nouveau"}{" "}
              <span style={{ color: "#6366f1" }}>Jury</span>
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Prénom", key: "firstName", type: "text" },
                  { label: "Nom", key: "lastName", type: "text" },
                ].map(({ label, key, type }) => (
                  <div key={key} className="space-y-2">
                    <label className="label-overline">{label}</label>
                    <input
                      required
                      type={type}
                      value={formData[key as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      style={{
                        width: "100%",
                        background: "transparent",
                        borderBottom: "1px solid var(--color-border)",
                        padding: "0.5rem 0",
                        fontSize: "0.875rem",
                        outline: "none",
                        color: "var(--color-text)",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderBottomColor = "#6366f1")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderBottomColor =
                          "var(--color-border)")
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="label-overline">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    background: "transparent",
                    borderBottom: "1px solid var(--color-border)",
                    padding: "0.5rem 0",
                    fontSize: "0.875rem",
                    outline: "none",
                    color: "var(--color-text)",
                    fontFamily: "monospace",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "#6366f1")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor = "var(--color-border)")
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-12">
              <button
                type="submit"
                style={{
                  background: "#6366f1",
                  color: "#fff",
                  padding: "1rem",
                  fontWeight: 900,
                  fontSize: "0.625rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Valider
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-text-faint)",
                  fontWeight: 700,
                  fontSize: "0.6875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  padding: "0.5rem",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-faint)")
                }
              >
                [ Annuler ]
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

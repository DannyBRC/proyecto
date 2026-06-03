require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET || "mi_llave_secreta_super_segura_123";
const usuarios = [];
const tickets = [{ id: 1, titulo: "Error en base de datos", estado: "Abierto" },{ id: 2, titulo: "Actualizar interfaz", estado: "En proceso" }];
app.post("/api/auth/register", async (req, res) => { const { email, password, role } = req.body; const existe = usuarios.find(u => u.email === email); if (existe) return res.status(400).json({ mensaje: "El usuario ya existe." }); const hashedPassword = await bcrypt.hash(password, 10); usuarios.push({ id: usuarios.length + 1, email, password: hashedPassword, role: role || "Client" }); res.status(201).json({ mensaje: "Usuario registrado." }); });
app.post("/api/auth/login", async (req, res) => { const { email, password } = req.body; const usuario = usuarios.find(u => u.email === email); if (!usuario) return res.status(400).json({ mensaje: "Credenciales incorrectas." }); const valido = await bcrypt.compare(password, usuario.password); if (!valido) return res.status(400).json({ mensaje: "Credenciales incorrectas." }); const token = jwt.sign({ id: usuario.id, email: usuario.email, role: usuario.role }, JWT_SECRET, { expiresIn: "1h" }); res.json({ token }); });
function verificarToken(req, res, next) { const token = req.headers["authorization"]?.split(" ")[1]; if (!token) return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado." }); try { req.user = jwt.verify(token, JWT_SECRET); next(); } catch (e) { res.status(403).json({ mensaje: "Token invalido o expirado." }); } }
function concederAccesoA(...roles) { return (req, res, next) => { if (!roles.includes(req.user.role)) return res.status(403).json({ mensaje: "No tienes permisos." }); next(); }; }
app.get("/api/tickets", verificarToken, (req, res) => { res.json({ usuario: req.user.email, tickets }); });
app.delete("/api/tickets/:id", verificarToken, concederAccesoA("Admin", "Support"), (req, res) => { res.json({ mensaje: "Ticket " + req.params.id + " eliminado.", ejecutadoPor: req.user.email }); });
app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));

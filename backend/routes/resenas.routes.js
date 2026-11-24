const express = require('express');
const pool = require('../config/db');
const verificarToken = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas de reseñas requieren token válido
router.use(verificarToken);

// GET /api/resenas - Listar SOLO las reseñas del usuario logueado
router.get('/', async (req, res) => {
    try {
        const [resenas] = await pool.query(
            `SELECT id, nombre_restaurante, calificacion, 
                    DATE_FORMAT(fecha_visita, '%Y-%m-%d') AS fecha_visita, 
                    observaciones 
             FROM resenas 
             WHERE usuario_id = ? 
             ORDER BY fecha_visita DESC, id DESC`,
            [req.usuario.id]
        );
        res.json(resenas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener las reseñas.' });
    }
});

// POST /api/resenas - Crear reseña vinculada al usuario logueado
router.post('/', async (req, res) => {
    const { nombre_restaurante, calificacion, fecha_visita, observaciones } = req.body;

    if (!nombre_restaurante || !calificacion || !fecha_visita) {
        return res.status(400).json({ mensaje: 'Nombre del restaurante, calificación y fecha de visita son obligatorios.' });
    }

    if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ mensaje: 'La calificación debe estar entre 1 y 5.' });
    }

    try {
        const [resultado] = await pool.query(
            `INSERT INTO resenas (nombre_restaurante, calificacion, fecha_visita, observaciones, usuario_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [nombre_restaurante, calificacion, fecha_visita, observaciones || '', req.usuario.id]
        );

        res.status(201).json({
            mensaje: 'Reseña creada exitosamente.',
            id: resultado.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear la reseña.' });
    }
});

// PUT /api/resenas/:id - Actualizar SOLO si pertenece al usuario logueado
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_restaurante, calificacion, fecha_visita, observaciones } = req.body;

    if (!nombre_restaurante || !calificacion || !fecha_visita) {
        return res.status(400).json({ mensaje: 'Nombre del restaurante, calificación y fecha de visita son obligatorios.' });
    }

    if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ mensaje: 'La calificación debe estar entre 1 y 5.' });
    }

    try {
        const [resultado] = await pool.query(
            `UPDATE resenas 
             SET nombre_restaurante = ?, calificacion = ?, fecha_visita = ?, observaciones = ? 
             WHERE id = ? AND usuario_id = ?`,
            [nombre_restaurante, calificacion, fecha_visita, observaciones || '', id, req.usuario.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Reseña no encontrada o no tienes permiso para editarla.' });
        }

        res.json({ mensaje: 'Reseña actualizada exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar la reseña.' });
    }
});

// DELETE /api/resenas/:id - Eliminar SOLO si pertenece al usuario logueado
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await pool.query(
            'DELETE FROM resenas WHERE id = ? AND usuario_id = ?',
            [id, req.usuario.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Reseña no encontrada o no tienes permiso para eliminarla.' });
        }

        res.json({ mensaje: 'Reseña eliminada exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar la reseña.' });
    }
});

module.exports = router;
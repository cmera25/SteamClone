const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
{
    // ID del usuario perteneciente al Auth Service.
    // Se utiliza para relacionar ambos microservicios.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },

    // Nombre visible del usuario dentro de la plataforma.
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 30
    },

    // ID del archivo almacenado en GridFS correspondiente
    // al avatar del usuario.
    avatarFileId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },

    // Descripción corta del usuario.
    bio: {
        type: String,
        default: '',
        maxlength: 500
    },

    // País del usuario (ISO 3166-1 alpha-2).
    // Ejemplo: CO, US, JP.
    country: {
        type: String,
        default: '',
        uppercase: true,
        maxlength: 2
    },

    // Idioma preferido (ISO 639-1).
    // Ejemplo: es, en, fr.
    language: {
        type: String,
        default: '',
        lowercase: true,
        maxlength: 2
    },

    // Nivel de privacidad del perfil.
    privacy: {
        type: String,
        enum: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
        default: 'PUBLIC',
        required: true
    },

    // Estado de presencia del usuario.
    presence: {
        type: String,
        enum: ['ONLINE', 'AWAY', 'OFFLINE', 'PLAYING'],
        default: 'OFFLINE',
        required: true
    },

    // Lista de usuarios bloqueados.
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId
    }],

    // Fecha de creación del perfil.
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(
    'Profile',
    profileSchema,
    'profiles'
);
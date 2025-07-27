import Note from "../models/Note.js";
import User from "../models/User.js";

const resolvers = {
  Query: {
    notes: async (
      _,
      { userId, title, startDate, endDate, page = 1, limit = 10 }
    ) => {
      const query = {};

      if (userId) query.userId = userId;
      if (title) query.title = { $regex: title, $options: "i" };
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const notes = await Note.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("userId"); // this gets full user info

      return notes;
    },
  },

  Mutation: {
    addNote: async (_, { title, content }, context) => {
      if (!context.user) throw new Error("Unauthorized");

      const newNote = await Note.create({
        title,
        content,
        userId: context.user.sub,
      });

      return newNote.populate("userId");
    },

    deleteNote: async (_, { id }, context) => {
      if (!context.user) throw new Error("Unauthorized");


      const note = await Note.findOne({ _id: id, userId: context.user.sub });
      if (!note) throw new Error("Note not found or access denied");

      await note.deleteOne();
      return true;
    },
  },

  Note: {
    user: (parent) => {
      
      // If populated, return directly. Else populate manually.
      return typeof parent.userId === "object"
        ? parent.userId
        : User.findById(parent.userId._id);
    },
  },
};

export default resolvers;

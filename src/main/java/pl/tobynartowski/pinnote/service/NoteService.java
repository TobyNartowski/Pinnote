package pl.tobynartowski.pinnote.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.tobynartowski.pinnote.model.Note;
import pl.tobynartowski.pinnote.model.User;
import pl.tobynartowski.pinnote.repository.NoteRepository;
import pl.tobynartowski.pinnote.repository.UserRepository;

import java.util.List;

@Service
public class NoteService {

    private NoteRepository noteRepository;
    private UserRepository userRepository;

    @Autowired
    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public Note addNote(User user, Note note) {
        note.setUser(user);
        Note savedNote = noteRepository.save(note);

        user.getNotes().add(note);
        userRepository.save(user);
        return savedNote;
    }

    public void removeNote(Note note) {
        User noteOwner = userRepository.findByNotesContains(note);
        noteOwner.getNotes().remove(note);
        userRepository.save(noteOwner);

        noteRepository.delete(note);
    }

    public List<Note> getNotesByEmail(String email) {
        List<Note> result = noteRepository.findAllByUserEmail(email);
        return result == null || result.isEmpty() ? null : result;
    }
}

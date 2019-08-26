package pl.tobynartowski.pinnote.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.tobynartowski.pinnote.model.Note;
import pl.tobynartowski.pinnote.model.Tag;
import pl.tobynartowski.pinnote.model.User;
import pl.tobynartowski.pinnote.repository.NoteRepository;
import pl.tobynartowski.pinnote.repository.TagRepository;
import pl.tobynartowski.pinnote.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private NoteRepository noteRepository;
    private UserRepository userRepository;
    private TagRepository tagRepository;

    @Autowired
    public NoteService(NoteRepository noteRepository, UserRepository userRepository, TagRepository tagRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
    }

    public Note addNote(User user, Note note) {
        note.setUser(user);

        note.setTags(note.getTags().stream().map(t -> {
            Tag found = tagRepository.findByName(t.getName());
            return found != null ? found : t;
        }).collect(Collectors.toList()));
        note.getTags().forEach(tagRepository::save);

        Note savedNote = noteRepository.save(note);

        user.getNotes().add(note);
        userRepository.save(user);
        return savedNote;
    }

    public void removeNote(UUID noteId) {
        Optional<Note> noteOptional = noteRepository.findById(noteId);
        if (noteOptional.isPresent()) {
            Note note = noteOptional.get();
            User noteOwner = userRepository.findByNotesContains(note);
            noteOwner.getNotes().remove(note);
            userRepository.save(noteOwner);

            List<Tag> checkTags = note.getTags();

            noteRepository.delete(note);
            checkTags.forEach(t -> {
                if (noteRepository.countNotesByTagsIsContaining(t) < 1) {
                    tagRepository.delete(t);
                }
            });
        }
    }

    public List<Note> getNotesByEmail(String email) {
        List<Note> result = noteRepository.findAllByUserEmail(email);
        return result == null || result.isEmpty() ? null : result;
    }

    public List<Note> getNotesByEmailAndTag(String email, String tagName) {
        Tag foundTag = tagRepository.findByName(tagName);
        return foundTag != null ? noteRepository.findAllByUserEmailAndTagsIsContaining(email, foundTag) : null;
    }
}

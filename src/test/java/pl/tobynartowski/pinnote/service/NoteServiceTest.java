package pl.tobynartowski.pinnote.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.MockitoJUnitRunner;
import pl.tobynartowski.pinnote.misc.NoteType;
import pl.tobynartowski.pinnote.model.Note;
import pl.tobynartowski.pinnote.model.User;
import pl.tobynartowski.pinnote.repository.NoteRepository;
import pl.tobynartowski.pinnote.repository.UserRepository;

import java.util.Arrays;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private UserRepository userRepository;

    private NoteService noteService;

    @Before
    public void init() {
        noteService = new NoteService(noteRepository, userRepository);

        when(noteRepository.save(any(Note.class))).then((InvocationOnMock i) -> {
            Note note = i.getArgument(0);
            note.setId(UUID.randomUUID());
            return note;
        });
    }

    @Test
    public void whenAddNote_passedCorrectNote_thenIdIsSet() {
        Note note = new Note("Title", "Content", null, NoteType.TEXT);

        note = noteService.addNote(new User("johndoe@gmail.com", "password"), note);
        assertThat(note.getId()).isNotNull();
    }

    @Test
    public void whenAddNote_passedCorrectNote_thenNoteIsAttachedToUser() {
        Note note = new Note("Title", "Content", null, NoteType.TEXT);
        User user = new User("johndoe@gmail.com", "password");

        note = noteService.addNote(user, note);
        assertThat(user.getNotes()).contains(note);
    }

    @Test
    public void whenRemoveNote_passedCorrectNote_thenNoteIsDetachedFromUser() {
        Note note = new Note("Title", "Content", null, NoteType.TEXT);
        User user = new User("johndoe@gmail.com", "password");
        noteService.addNote(user, note);

        when(userRepository.findByNotesContains(note)).thenReturn(user);

        noteService.removeNote(note);
        assertThat(user.getNotes()).doesNotContain(note);
    }

    @Test
    public void whenGetNotesByEmail_passedCorrectEmail_thenReturnListOfNotes() {
        User user = new User("johndoe@gmail.com", "password");
        user.setNotes(Arrays.asList(
                new Note("Title", "Content", null, NoteType.TEXT),
                new Note("Ttitle2", "Second content", null, NoteType.TEXT)
        ));

        when(noteRepository.findAllByUserEmail(anyString())).thenReturn(user.getNotes());

        assertThat(noteService.getNotesByEmail(user.getEmail())).isEqualTo(user.getNotes());
    }
}

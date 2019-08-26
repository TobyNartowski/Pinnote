package pl.tobynartowski.pinnote.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.MockitoJUnitRunner;
import pl.tobynartowski.pinnote.misc.NoteType;
import pl.tobynartowski.pinnote.model.Note;
import pl.tobynartowski.pinnote.model.Tag;
import pl.tobynartowski.pinnote.model.User;
import pl.tobynartowski.pinnote.repository.NoteRepository;
import pl.tobynartowski.pinnote.repository.TagRepository;
import pl.tobynartowski.pinnote.repository.UserRepository;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
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

    @Mock
    private TagRepository tagRepository;

    private NoteService noteService;

    @Before
    public void init() {
        noteService = new NoteService(noteRepository, userRepository, tagRepository);

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

        when(noteRepository.findById(any(UUID.class))).thenReturn(Optional.of(note));
        when(userRepository.findByNotesContains(note)).thenReturn(user);

        noteService.removeNote(note.getId());
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

    @Test
    public void whenGetNotesByEmailAndTag_passedCorrectValues_thenReturnListOfNotes() {
        User user = new User("johndoe@gmail.com", "password");

        Tag firstTag = new Tag("first");
        Note firstNote =  new Note("Title", "Content", null, NoteType.TEXT);
        firstNote.setTags(Arrays.asList(firstTag, new Tag("second")));

        Note secondNote = new Note("Title2", "Second content", null, NoteType.TEXT);
        secondNote.setTags(Arrays.asList(new Tag("third"), new Tag("fourth")));
        user.setNotes(Arrays.asList(firstNote, secondNote));

        when(tagRepository.findByName(anyString())).thenReturn(firstTag);
        when(noteRepository.findAllByUserEmailAndTagsIsContaining(anyString(), any(Tag.class)))
                .thenReturn(Collections.singletonList(user.getNotes().get(0)));

        assertThat(noteService.getNotesByEmailAndTag(user.getEmail(), "first")).isEqualTo(Collections.singletonList(user.getNotes().get(0)));
    }

    @Test
    public void whenGetNotesByEmailAndTag_passedWrongTag_thenReturnNull() {
        User user = new User("johndoe@gmail.com", "password");

        when(tagRepository.findByName(anyString())).thenReturn(null);

        assertThat(noteService.getNotesByEmailAndTag(user.getEmail(), "nonexistingtag")).isNull();
    }
}

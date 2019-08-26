package pl.tobynartowski.pinnote.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import pl.tobynartowski.pinnote.model.Note;
import pl.tobynartowski.pinnote.model.Tag;

import java.util.List;
import java.util.UUID;

@Repository
public interface NoteRepository extends PagingAndSortingRepository<Note, UUID> {

    List<Note> findAllByUserEmail(String email);

    List<Note> findAllByUserEmailAndTagsIsContaining(String email, Tag tag);

    Long countNotesByTagsIsContaining(Tag tag);
}

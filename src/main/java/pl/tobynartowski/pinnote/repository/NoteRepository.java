package pl.tobynartowski.pinnote.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import pl.tobynartowski.pinnote.model.Note;

import java.util.UUID;

@Repository
public interface NoteRepository extends PagingAndSortingRepository<Note, UUID> {

}

package pl.tobynartowski.pinnote.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.tobynartowski.pinnote.model.Note;
import pl.tobynartowski.pinnote.model.User;

import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID> {

    User findByEmail(String email);

    User findByNotesContains(Note note);
}

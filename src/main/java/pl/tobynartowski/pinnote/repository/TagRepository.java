package pl.tobynartowski.pinnote.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.tobynartowski.pinnote.model.Tag;

@Repository
public interface TagRepository extends CrudRepository<Tag, Long> {
}

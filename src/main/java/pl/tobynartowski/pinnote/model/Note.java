package pl.tobynartowski.pinnote.model;

import org.hibernate.annotations.Type;
import pl.tobynartowski.pinnote.misc.NoteType;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
public class Note implements Serializable {

    private static final long serialVersionUID = -6254651825162955482L;

    @Id
    @GeneratedValue
    @Column(columnDefinition = "VARCHAR(36)")
    @Type(type = "uuid-char")
    private UUID id;

    @NotBlank
    @Size(min = 3, max = 64)
    private String title;

    @Size(max = 4096)
    private String contentText;

    @Size(max = 1024)
    private String contentMedia;

    @NotNull
    @Enumerated(EnumType.STRING)
    private NoteType type;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Tag> tags = new HashSet<>();

    public Note() {}

    public Note(@NotBlank @Size(min = 3, max = 64) String title, @Size(max = 4096) String contentText, @Size(max = 1024) String contentMedia, @NotNull NoteType type) {
        this.title = title;
        this.contentText = contentText;
        this.contentMedia = contentMedia;
        this.type = type;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContentText() {
        return contentText;
    }

    public void setContentText(String contentText) {
        this.contentText = contentText;
    }

    public String getContentMedia() {
        return contentMedia;
    }

    public void setContentMedia(String contentMedia) {
        this.contentMedia = contentMedia;
    }

    public NoteType getType() {
        return type;
    }

    public void setType(NoteType type) {
        this.type = type;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}

package pl.tobynartowski.pinnote.model;

import org.hibernate.annotations.Type;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
public class User implements Serializable {

    private static final long serialVersionUID = 6074119829030852623L;

    @Id
    @GeneratedValue
    @Column(columnDefinition = "VARCHAR(36)")
    @Type(type = "uuid-char")
    private UUID id;

    @NotBlank
    @Email
    @Size(max = 128)
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(min = 6, max = 68)
    private String password;

    @OneToMany(orphanRemoval = true)
    private Set<Note> notes = new HashSet<>();

    private String role = "ROLE_USER";

    public User() {}

    public User(@NotBlank @Email @Size(max = 64) String email, @NotBlank @Size(min = 5, max = 64) String password) {
        this.email = email;
        this.password = password;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Note> getNotes() {
        return notes;
    }

    public void setNotes(Set<Note> notes) {
        this.notes = notes;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

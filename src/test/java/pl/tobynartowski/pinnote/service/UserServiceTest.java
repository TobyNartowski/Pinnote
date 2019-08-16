package pl.tobynartowski.pinnote.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.tobynartowski.pinnote.model.User;
import pl.tobynartowski.pinnote.repository.UserRepository;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @Before
    public void init() {
        userService = new UserService(userRepository, passwordEncoder);

        when(userRepository.save(any(User.class))).then((InvocationOnMock i) -> {
            User user = i.getArgument(0);
            user.setId(UUID.randomUUID());
            return user;
        });
    }

    @Test
    public void whenRegisterUser_passedCorrectUser_thenIdIsSet() {
        User savedUser = userService.registerUser(new User("someoneelse@gmail.com", "pass"));
        assertThat(savedUser.getId()).isNotNull();
    }

    @Test
    public void whenRegisterUser_passedCorrectUser_thenPasswordIsHashed() {
        User user = new User("johndoe@gmail.com", "password");
        when(passwordEncoder.encode(anyString())).thenReturn("{bcrypt}$2a$10$/gjHI9PY1zww76YLpYJ2DuGroZfJyXzer2Rmev/oY24B3UcJoXcAC");

        user = userService.registerUser(user);
        assertThat(user.getPassword()).hasSize(68);
    }

    @Test
    public void whenIfUserExists_exists_thenReturnTrue() {
        User user = new User("johndoe@gmail.com", "password");
        user.setId(UUID.randomUUID());
        when(userRepository.findByEmail(anyString())).thenReturn(user);

        assertThat(userService.checkIfUserExists(user.getEmail())).isEqualTo(true);
    }

    @Test
    public void whenIfUserExists_notExists_thenReturnTrue() {
        when(userRepository.findByEmail(anyString())).thenReturn(null);

        assertThat(userService.checkIfUserExists("someone")).isEqualTo(false);
    }
}

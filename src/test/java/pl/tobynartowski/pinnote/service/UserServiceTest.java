package pl.tobynartowski.pinnote.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
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
    }

    @Test
    public void whenRegisterUserSuccess_thenReturningUserWithId() {
        User user = new User("johndoe@gmail.com", "password");
        user.setId(UUID.randomUUID());
        when(userRepository.save(any(User.class))).thenReturn(user);

        User savedUser = userService.registerUser(new User("someoneelse@gmail.com", "pass"));
        assertThat(savedUser.getId()).isNotNull();
    }

    @Test
    public void whenRegisterUserSuccess_thenPasswordIsHashed() {
        User user = new User("johndoe@gmail.com", "password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(passwordEncoder.encode(anyString())).thenReturn("{bcrypt}$2a$10$/gjHI9PY1zww76YLpYJ2DuGroZfJyXzer2Rmev/oY24B3UcJoXcAC");

        user = userService.registerUser(user);
        assertThat(user.getPassword()).hasSize(68);
    }
}

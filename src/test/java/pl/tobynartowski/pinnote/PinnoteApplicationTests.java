package pl.tobynartowski.pinnote;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import pl.tobynartowski.pinnote.service.NoteServiceTest;
import pl.tobynartowski.pinnote.service.UserServiceTest;

@RunWith(Suite.class)
@Suite.SuiteClasses({
        UserServiceTest.class,
        NoteServiceTest.class
})
public class PinnoteApplicationTests {
}

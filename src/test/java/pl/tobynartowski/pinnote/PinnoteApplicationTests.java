package pl.tobynartowski.pinnote;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import pl.tobynartowski.pinnote.service.UserServiceTest;

@RunWith(Suite.class)
@Suite.SuiteClasses({
    UserServiceTest.class
})
public class PinnoteApplicationTests {
}

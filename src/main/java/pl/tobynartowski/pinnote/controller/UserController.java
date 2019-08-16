package pl.tobynartowski.pinnote.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import pl.tobynartowski.pinnote.model.User;
import pl.tobynartowski.pinnote.service.UserService;

import javax.validation.Valid;

@Controller
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping("/")
    public String index() {
        return "index";
    }

    @RequestMapping("/register")
    public String register(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String addUser(@ModelAttribute @Valid User user, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        bindingResult.getFieldErrors().forEach(f -> System.out.println(f.getField() + ": " + f.getDefaultMessage()));

        if (!bindingResult.hasErrors()) {
            if (!userService.checkIfUserExists(user.getEmail())) {
                userService.registerUser(user);
            } else {
                redirectAttributes.addAttribute("error", "exists");
                return "redirect:register";
            }
            return "redirect:index";
        } else {
            redirectAttributes.addAttribute("error", "other");
            return "redirect:register";
        }
    }
}

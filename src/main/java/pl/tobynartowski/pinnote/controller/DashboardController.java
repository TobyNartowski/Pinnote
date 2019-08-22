package pl.tobynartowski.pinnote.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.tobynartowski.pinnote.model.Note;
import pl.tobynartowski.pinnote.model.Tag;
import pl.tobynartowski.pinnote.service.NoteService;
import pl.tobynartowski.pinnote.service.UserService;

import java.security.Principal;
import java.util.Arrays;

@Controller
public class DashboardController {

    private NoteService noteService;
    private UserService userService;

    @Autowired
    public DashboardController(NoteService noteService, UserService userService) {
        this.noteService = noteService;
        this.userService = userService;
    }

    @RequestMapping("/dashboard")
    public String dashboard(Model model, Principal principal) {
        model.addAttribute("notes", noteService.getNotesByEmail(principal.getName()));
        Note newNote = new Note();
        newNote.setTags(Arrays.asList(new Tag(), new Tag(), new Tag(), new Tag(), new Tag(), new Tag()));
        model.addAttribute("note", newNote);
        return "dashboard";
    }

    @PostMapping("/dashboard/add")
    public String add(@ModelAttribute Note note, Principal principal) {
        note.getTags().removeIf(tag -> tag.getName().isBlank());
        noteService.addNote(userService.getUserByEmail(principal.getName()), note);
        return "redirect:/";
    }
}

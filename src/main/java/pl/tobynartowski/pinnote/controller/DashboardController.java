package pl.tobynartowski.pinnote.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.tobynartowski.pinnote.service.NoteService;

import java.security.Principal;

@Controller
public class DashboardController {

    private NoteService noteService;

    @Autowired
    public DashboardController(NoteService noteService) {
        this.noteService = noteService;
    }

    @RequestMapping("/dashboard")
    public String dashboard(Model model, Principal principal) {
        model.addAttribute("notes", noteService.getNotesByEmail(principal.getName()));
        return "dashboard";
    }
}

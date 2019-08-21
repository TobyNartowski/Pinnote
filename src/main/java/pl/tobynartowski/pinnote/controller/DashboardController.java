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

import java.security.Principal;
import java.util.Arrays;

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
        Note newNote = new Note();
        newNote.setTags(Arrays.asList(new Tag(), new Tag(), new Tag(), new Tag(), new Tag(), new Tag()));
        model.addAttribute("note", newNote);
        return "dashboard";
    }

    @PostMapping("/dashboard/add")
    public String add(@ModelAttribute Note note) {
        System.err.println("-- New note --");
        System.err.println("Title:" + note.getTitle() + ";");
        System.err.println("Text:" + note.getContentText() + ";");
        System.err.println("Media:" + note.getContentMedia() + ";");
        System.err.print("Tags:");
        note.getTags().forEach(t -> System.err.print(" " + t.getName()));
        System.err.println(";");
        System.err.println("Type:" + note.getType() + ";");
        return "redirect:/";
    }
}

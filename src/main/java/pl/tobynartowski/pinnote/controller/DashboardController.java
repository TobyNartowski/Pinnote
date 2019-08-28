package pl.tobynartowski.pinnote.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;
import pl.tobynartowski.pinnote.model.Note;
import pl.tobynartowski.pinnote.model.Tag;
import pl.tobynartowski.pinnote.service.NoteService;
import pl.tobynartowski.pinnote.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Controller
public class DashboardController {

    private NoteService noteService;
    private UserService userService;

    @Autowired
    public DashboardController(NoteService noteService, UserService userService) {
        this.noteService = noteService;
        this.userService = userService;
    }

    private void getAllDashboardData(Model model, Principal principal, String tag) {
        List<Note> allNotes = noteService.getNotesByEmail(principal.getName());
        model.addAttribute("notes", allNotes);

        if (allNotes != null) {
            List<Tag> allTags = new ArrayList<>();
            allNotes.forEach(n -> allTags.addAll(n.getTags()));

            Set<Tag> sortedTags = new LinkedHashSet<>();
            if (tag != null) {
                allTags.stream().filter(t -> t.getName().equals(tag)).findAny().ifPresent(sortedTags::add);
            }

            sortedTags.addAll(allTags
                    .stream().collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                    .entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                    .limit(10).collect(LinkedHashSet::new, (s, m) -> s.add(m.getKey()), Set::addAll));



            model.addAttribute("tags", sortedTags);
        }

        Note newNote = new Note();
        newNote.setTags(Arrays.asList(new Tag(), new Tag(), new Tag(), new Tag(), new Tag(), new Tag()));
        model.addAttribute("note", newNote);

    }

    @RequestMapping("/dashboard")
    public String dashboard(Model model, Principal principal) {
        getAllDashboardData(model, principal, null);
        return "dashboard";
    }

    @RequestMapping("/dashboard/{tag}")
    public String filter(Model model, Principal principal, @PathVariable String tag) {
        List<Note> foundNotes = noteService.getNotesByEmailAndTag(principal.getName(), tag);
        getAllDashboardData(model, principal, tag);

        if (foundNotes != null) {
            model.addAttribute("notes", foundNotes);
            model.addAttribute("filter", tag);
        }

        return "dashboard";
    }

    @PostMapping("/dashboard/add")
    public RedirectView add(@ModelAttribute @Valid Note note, BindingResult bindingResult, Principal principal,
                            RedirectAttributes redirectAttributes) {
        if (note.getTitle().isBlank()) {
            if (note.getContentText().length() < 17) {
                note.setTitle(note.getContentText());
            } else {
                note.setTitle(note.getContentText().substring(0, 17) + "...");
            }
        }

        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("error", "new");
            return new RedirectView("/dashboard", false);
        }

        note.getTags().removeIf(tag -> tag.getName().isBlank());
        note.getTags().forEach(t -> t.setName(t.getName().toLowerCase().substring(1)));
        noteService.addNote(userService.getUserByEmail(principal.getName()), note);
        return new RedirectView("/dashboard", false);
    }

    @RequestMapping("/dashboard/delete/{id}")
    public RedirectView delete(@PathVariable UUID id) {
        noteService.removeNote(id);
        return new RedirectView("/dashboard", false);
    }
}

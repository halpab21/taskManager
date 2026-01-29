package at.halasi.backend;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class SpaController {

    @RequestMapping(value = "/{path:[^\\.]*}", method = RequestMethod.GET)
    public String index() {
        return "forward:/index.html";
    }
}

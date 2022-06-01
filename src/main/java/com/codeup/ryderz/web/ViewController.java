package com.codeup.ryderz.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@CrossOrigin
@Controller
public class ViewController {
    
    @RequestMapping({"/","/about", "/posts", "/login","/home","/register","/user", "/newsfeed", "/discover", "/event", "/group","/profile", "/createEvent", "/createGroup", "/error"})
    public String showView(){
        return "forward:/index.html";
    }
//
//    @RequestMapping({"/group/{groupId}"})
//    public String showViewVariablePath(@PathVariable("groupId") long groupId) {
//        return "forward:/index.html?var1=" + groupId;
//    }
}

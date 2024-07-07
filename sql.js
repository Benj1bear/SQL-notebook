setup()
function setup(){
    // making sure user has the requirements
    // e.g. sqlite3 (builtin) (ipython-sql)
    // run a python script (it can be in a different process I guess)
    Jupyter.notebook.select_prev();
    let cell = Jupyter.notebook.get_selected_cell();
    let code = cell.get_text();
    cell.set_text("\nimport sqlite3 as sql\nfrom my_pack import check_and_get\ncheck_and_get(['ipython-sql'])\n%load_ext sql\n");
    cell.execute();
    cell.set_text(code);
}
function load_db(){
    // on load make sure sql stuff is loaded
    let db = prompt("Enter a database file to connect to:");
    // for flexibility
    let splitted = db.split(".");
    if (splitted[1] === "db"){db = splitted[0];}
    let cell = Jupyter.notebook.get_selected_cell();
    let code = cell.get_text();
    cell.set_text(code+"\n%sql sqlite:///"+db+".db\nprint('"+db+".db loaded')");
    cell.execute();
    cell.set_text(code);
}
function custom_run_cell() {
    /* my function for preprocessing jupyter notebook cells (extracted from my other repo *pipe-operator-for-jupyter-notebook*) */
    // get cell, get input, overwrite with interpretation with javascript
    let cell=Jupyter.notebook.get_selected_cell();
    let code=cell.get_text();
    // add in sql code
    cell.set_text("%%sql\n"+code);
    // run as usual
    cell.execute();
    // set back to the code
    cell.set_text(code);
    Jupyter.notebook.select_next();
    if (Jupyter.notebook.get_selected_cell().cell_id === cell.cell_id){
        Jupyter.notebook.insert_cell_below();
        Jupyter.notebook.select_next();
    }
}
/* load_db - for loading db files*/
// command shortcuts
Jupyter.keyboard_manager.command_shortcuts.add_shortcut('Ctrl-Shift-L', {
    help : 'load db file',
    handler : load_db
});
// editing shortcuts
Jupyter.keyboard_manager.edit_shortcuts.add_shortcut('Ctrl-Shift-L', {
    help : 'load db file',
    handler : load_db
});
/* custom_run_cell - for running the sql code */
// command shortcuts
Jupyter.keyboard_manager.command_shortcuts.add_shortcut('Ctrl-Shift-Enter', {
    help : 'preprocess cell (for running sql code)',
    handler : custom_run_cell
});
// editing shortcuts
Jupyter.keyboard_manager.edit_shortcuts.add_shortcut('Ctrl-Shift-Enter', {
    help : 'preprocess cell (for running sql code)',
    handler : custom_run_cell
});
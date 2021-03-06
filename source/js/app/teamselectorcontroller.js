TeamSelectorController.prototype = new EventDispatcher();
TeamSelectorController.constructor = TeamSelectorController;
function TeamSelectorController()
 {
    var self     = this;
    var selected = null;
    var teams    = null;

    self.buildList = buildList;

    function checkCookiedTeam(){
        var cTeam = null
        
        if($.cookie('team')){
            var teamlist = self.teams.getAll();
            var tid = $.cookie('team');
            cTeam = {'team':teamlist[tid]}
        }
        
        return cTeam;
        
    }
    
    function buildList(teams) {
        self.teams = teams;
        var teamData = [];
        var columnData = []
        
        var teamlist = self.teams.getAll();
        //teamlist = teamlist.sort(function(a,b){return a.name - b.name})
        for (t in teamlist) {
            teamData.push({
                'shortName': teamlist[t].shortName,
                'name': teamlist[t].displayName
            })
        }

        var columns = '{{each columns}}<ul class="team-column">{{each $value}}<li><a href="#" id="${$value.shortName}">${$value.name}</a></li>{{/each}}</ul>{{/each}}'

        $.template("columns", columns);

        var columnList = [
            teamData.splice(0, 11),
            teamData.splice(0, 11),
            teamData.splice(0, 11),
            teamData.splice(0, 11),
            teamData.splice(0, 12),
            teamData.splice(0, 12)
        ]

        var teamListView = $.tmpl("columns", {
            'columns': columnList
        });
        
        $('#team-selector a').qtip({
            content: teamListView,
            show: 'mouseover',
            hide: { when: 'mouseout', fixed: true, delay:500 },
            api : {
                onRender:activateLinks
            },
            style: {
                tip: 'bottomRight',
                width: 870,
                border: {
                    width: 0,
                    radius: 5,
                    color: '#fff'
                }
            },
            position: {
                corner: {
                    target: 'topRight',
                    tooltip: 'bottomRight'
                }
            }
        })
        
        var faveTeam = checkCookiedTeam()
        
        if(faveTeam){
            self.selected = faveTeam
            dispatchEvent("onTeamSelect", self);
        }
    }
    
    function activateLinks(){
        $('.team-column a').each(function(){
            $(this).click(function(){
                var teamlist = self.teams.getAll();
                var tid = $(this).attr('id');
                self.selected = {'team':teamlist[tid]}
                $.cookie('team', tid, { expires: 30, path: '/' });
        	    dispatchEvent("onTeamSelect", self);
                return false;
            })
        })
    }
    return self
}


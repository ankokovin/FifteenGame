class GameNode{
    constructor(ar, height, parent){
        this.ar = ar;
        this.zero = -1;
        for (let i = 0; i < this.ar.length; i++) {
            if (this.ar[i] === 0){
                this.zero = i;
            }
        }
        this.height = height;
        this.parent = parent;
        this.children = [];
        this.onPath = false;
    }


    getHtml(){
        var result =  "<div><table>";
        for(let i=0;i<3;++i){
            result += "<tr>";
            for(let j=0;j<3;++j){
                result += "<td>";
                if (this.ar[3*i+j]!= 0) result+=this.ar[3*i+j];
                result += "</td>";
            }
            result += "</tr>";
        }
        result += "</table></div>";

        return result;
    }
}
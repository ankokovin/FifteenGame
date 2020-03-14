var startPos;
var endPos;
var gameNodes;
var was;
function setup(){
    startPos = new GameNode([2,1,6,4,0,8,7,5,3],0,null);
    startPos.onPath = true;
    endPos = new GameNode([1,2,3,8,0,4,7,6,5],1, startPos);
    
}

function Dist(a, b){
    var res = 0;
    for (let i=0; i<3; ++i){
        for (let j =0; j < 3; ++j){
            for(let k=0; k<3; ++k){
                for(let l=0; l<3; ++l){
                    if (a.ar[3*i+j] == b.ar[3*k+l]){
                        res += Math.abs(i-k) + Math.abs(j-l);
                    }
                }
            }
        }
    }
    return res;
}

mv = [{x:0, y:1},{x:1, y:0}, {x:0, y:-1}, {x:-1, y:0}];

function hash(ar){
    res = 0;
    r = 1;
    for (let i = 0; i < ar.length; i++) {
        const el = ar[i];
        res += el*r;
        r*=9;
    }
    return res;
}

function Move(pos){
    let y = pos.zero % 3;
    let x = (pos.zero - y)/3;
    var result = [];
    mv.forEach(move => {
        let nx = x+move.x;
        let ny = y+move.y;
        if (nx <0 || nx >2 || ny <0 || ny>2) return;
        let nar = [...pos.ar];
        [nar[nx*3+ny], nar[pos.zero]] = [nar[pos.zero], nar[nx*3+ny]] ;
        if (was.has(hash(nar))) return;
        else{
            was.add(hash(nar));
            result.push(new GameNode(nar, pos.height+1, pos));
        } 
    });
    return result;
}

function structure(gameNode){
    stack = [{node: gameNode, data: {
        innerHTML: gameNode.getHtml(),
        children: []
        }, 
        idx: 0
    }];
    var stop = false;
    while(!stop){
        var t = stack[stack.length-1];
        if (t.idx == t.node.children.length){
            stack.pop();
            if (stack.length == 0){
                stop = true;
                return t.data;
            }else{
                stack[stack.length-1].data.children.push(t.data);
            }
        }else{
            var node = t.node.children[t.idx];

            var n = {
                node: node,
                data: {
                    innerHTML: node.getHtml(),
                    children: [] 
                }, 
                idx: 0
            }

            if (!node.onPath)
                n.data.collapsed = true
            
            
            stack.push(n);
            
            t.idx++;
        }
    }
}


function showTree(){
    
    var nodeStructure = structure(startPos);

    simple_chart_config = {
        chart: {
            container: "#tree",
            scrollbar: "fancy"
        },
        
        nodeStructure: nodeStructure
        
    };
    
    var my_tree = new Treant(simple_chart_config);
}
var Alpha;
function evalNode(a){
    return Alpha*a.height + Dist(a, endPos);
}


function comp(a, b){
    return evalNode(a) - evalNode(b);
}
function StartOne(){
    Alpha = document.getElementById("alpha").value;
    var result = Start();
    showTree();
    alert("Длина: "+result.length+"\nКоличество: "+result.count+"\nЭффективность: "+(result.length/result.count));
}

function StartSearch(){
    var count = parseInt(document.getElementById("count").value);
    var step =  parseFloat(document.getElementById("step").value);
    var mult =  parseFloat(document.getElementById("mult").value);
    var best = {
        count: 1000000000,
        length: 10000000000,
        prod: NaN,
        alpha: NaN,
    };
    for (var curCount=0; curCount < count;curCount++){
        var curStep = step+step*0.5*(0.5-Math.random());
        var curMult = mult+ 0.5*mult*(0.5-Math.random());
        Alpha = Math.random()*step*0.5+step;
        if (Math.random()>0.5) Alpha = 1/Alpha;
        console.log(curCount+": from "+Alpha+" step "+curStep+" mult "+curMult);
        var res = Start();
        var cnt = res.count;
        var l = res.length;
        var balpha = Alpha;
        var right = true;
        do{
            if (right){
                Alpha += curStep;
            }else{
                Alpha -= curStep;
            }
            res = Start();
            if (res.length > l || res.count > cnt){
                right = !right;
                curStep = curStep*curMult;       
             //  console.log("ncurstep: "+curStep);
            }else if (res.length < l || res.count < cnt){
                l = res.length;
                cnt = res.count;
                balpha = Alpha;
            } 
        }while(curStep > 1e-10)
        if (l < best.length || (l == best.length && cnt < best.count)) {
            best = {
                length: l,
                count: cnt,
                alpha: balpha,
                prod: l/cnt
            }
        }
    }
    console.log(best.alpha);
    alert(JSON.stringify(best));
}

function Start(){
    //console.log('Started with Alpha:'+Alpha);
    was = new Set();
    was.add(hash(startPos.ar));
    
    var queue = new PriorityQueue({comparator: comp});
    queue.queue(startPos);
    var stop = false;
    while(!stop){
        var elem = queue.dequeue();
        elem.children = Move(elem);
        elem.children.forEach(element => {
            if (Dist(element, endPos) == 0){
                stop = true;
                endPos = element;
                endPos.onPath = true;
            }else{
                queue.queue(element);
            }
        });
        if (queue.length == 0) stop = true;    
    }
    if (endPos.onPath === false) console.alert("End was not found");
    else{
        var t = endPos;
        while(t.parent!=null){
            t = t.parent;
            t.onPath = true;
        }
    }
    var result= {
        length: endPos.height,
        count: was.size
    };
    //console.log(result)
    return result; 
}








setup();

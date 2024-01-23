var canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");

//캔버스 크기를 화면 전체로
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//초기 검은색 보드 크기, 위치
var size = 800;
var x = canvas.width/2-size/2;
var y = canvas.height/2-size/2;

//흰색 보드 크기
var board_size = size/3.5;

//캐릭터 크기 비율
var chr_size_value = 0.35;

//위험 구역 빈도
var danger_fre = 60;

//점수(경과 시간)
var score = 0;

//크기 조절(300~900)
function get_size() {
    size = document.getElementById("main_bar").value;
    canvas_reset();
}

//캐릭터 크기 조절(0.2~0.5)
function get_chr_size() {
    chr_size_value = document.getElementById("chr_bar").value;
    canvas_reset();
}

//캔버스 초기화
function canvas_reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    x = canvas.width/2-size/2;
    y = canvas.height/2-size/2;
    board_size = size/3.5;
    Character.chr_x = x + size/2;
    Character.chr_y = y + size/2;
    Character.chr_size = board_size*chr_size_value;
    
    Background.draw();
    Character.draw();
}

//초기 테마 색상
var main_color = "black";
var board_color = "white";
var danger_color_01 = "rgb(255,112, 18)";
var danger_color_02 = "red";

//테마 설정
function setting_theme(num) {
    //선택한 색을 제외하고 전부 기본값
    var theme_color = document.getElementsByClassName("theme_infor");
    for (let i = 0; i < theme_color.length; i++) {
        theme_color.item(i).style.color = "gray";
        //선택한 색 고유효과
        if(i === num-1) {
            theme_color.item(i).style.color = "black";
            theme_color.item(i).style.fontWeight = "bold";
        }
    }

    //케이스 별 테마 조정
    switch (num) {
        case 1:
            main_color = "black";
            board_color = "white";
            danger_color_01 = "rgb(255,112, 18)";
            danger_color_02 = "red";
            break;
        case 2:
            main_color = "black";
            board_color = "rgb(255, 255, 151)";
            danger_color_01 = "rgb(255, 112, 18)";
            danger_color_02 = "rgb(150, 60, 7)";
            break;
        case 3:
            main_color = "black";
            board_color = "rgb(210, 183, 108)";
            danger_color_01 = "rgb(117, 188, 0)";
            danger_color_02 = "rgb(29, 139, 21)";
            break;
        case 4:
            main_color = "black";
            board_color = "rgb(232, 255, 255)";
            danger_color_01 = "rgba(177, 177, 177)";
            danger_color_02 = "rgb(43, 165, 186)";
            break;
        case 5:
            main_color = "black";
            board_color = "rgb(214, 240, 255)";
            danger_color_01 = "rgb(54, 138, 255)";
            danger_color_02 = "rgb(37, 36, 255)";
            break;
        case 6:
            main_color = "black";
            board_color = "rgb(234, 234, 234)";
            danger_color_01 = "rgb(119, 9, 119)";
            danger_color_02 = "black";
            break;
        case 7:
            main_color = "white";
            board_color = "black";
            danger_color_01 = "rgb(234, 234, 234)";
            danger_color_02 = "white";
            break;
    }
    canvas_reset();
}

//메인 보드
var Background = {
    //흰색 보드 간격
    board_padding : 0,
    draw() {
        ctx.fillStyle = main_color;
        //검은색 보드 채우기
        ctx.fillRect(x, y, size, size);

        //흰색 보드 채우기
        ctx.fillStyle = board_color;
        this.board_padding = (size-3*board_size)/5;
        //3x3 보드에 일정한 간격으로 흰색 보드 생성
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                ctx.fillRect(this.board_padding/2+x+(size/3*j), this.board_padding/2+y+(size/3*i) ,size/3-this.board_padding, size/3-this.board_padding);
            }
        }
    }
}

//캐릭터
var Character = {
    //중앙 설정
    chr_x : x + size/2,
    chr_y : y + size/2,
    //보드 크기에 비례하여 크기 설정
    chr_size : board_size*chr_size_value,
    draw() {
        //원 생성
        ctx.beginPath();
        ctx.arc(this.chr_x, this.chr_y, this.chr_size, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fillStyle = main_color;
        ctx.fill();
    }
}

//위험 지역
class Danger {
    constructor(dan_x, dan_y) {
        this.dan_x = dan_x;
        this.dan_y = dan_y;
        this.time = 0;
    }
    //위험 구역 지정
    draw() {
        //시간이 지나면 주황 -> 빨강
        if(this.time < danger_fre-3) {
            ctx.fillStyle = danger_color_01;
        }
        else {
            ctx.fillStyle = danger_color_02;
        }

        //흰 보드의 크기와 위치가 알맞는 위험 구역
        var d_x = Background.board_padding/2+x+(size/3*this.dan_x);
        var d_y = Background.board_padding/2+y+(size/3*this.dan_y);
        var width = size/3-Background.board_padding;
        var height = size/3-Background.board_padding;

        for(let i = 0; i<danger_list.length; i++) {
            ctx.fillRect(d_x, d_y, width, height);
        }
    }
}

var start = false;
var timer = 0;
var danger_list = [];
var animation;
//캔버스 클리어 및 재구성
function frame_timer() {
    timer++;
    //매 프레임마다 반복
    animation = requestAnimationFrame(frame_timer);
    
    if(timer%20 === 0) {
         score += 1;
         //스코어보드 갱신
         document.getElementById("score").innerHTML = score;
         //score가 50점 늘어날때마다 위험 지역 빈도 늘리기(최소치 20)
         if(score%50 === 0 && danger_fre > 20) {
            danger_fre -= 5;
         }
    }
    //캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);
        
    if(timer % Math.round(danger_fre/3) === 0) {
        //랜덤 좌표 추가
        let rand_x = Math.floor(Math.random() * 3);
        let rand_y = Math.floor(Math.random() * 3);

        //현재 위치가 이미 위험 구역인지 체크
        let check = true;
        danger_list.forEach((a)=> {
            if(a.dan_x === rand_x && a.dan_y === rand_y) {
                check = false
            }
        })

        //비어있다면
        if(check) {
            //랜덤 x와 랜덤 y를 가진 새로운 Danger 생성
            var danger = new Danger(rand_x, rand_y);
            //해당 객체의 정보를 리스트에 담아둠
            danger_list.push(danger);
        }
    }
    //배경 그리기
    Background.draw();
    
    //위험 지역 삭제 및 그리기
    danger_list.forEach((a, i, o)=> {
        //일정 시간이 지났을때
        if(a.time > danger_fre) {
            //충돌했다면 종료
            if(collision(Character, a)) {
                g_o_timer = 0;
                //최고기록 갱신
                if(b_score < score) {
                    b_score = score;
                    document.getElementById("best_score").innerHTML = b_score;
                }
                
                game_over_timer_02();
                cancelAnimationFrame(animation);
            }
            //삭제
            o.splice(i, 1);
        }
        a.time++;
        a.draw();
    })
    //캐릭터 그리기
    Character.draw();
}

var g_o_timer = 0;
function game_over_timer_02() {
    g_o_timer++
    g_o_time = requestAnimationFrame(game_over_timer_02);
    //일정 시간 후에 작동
    if(g_o_timer > 40) {
        start = false;
        //게임이 끝난 후 UI 보이기
        document.getElementById("setting").style.display="block";
        document.getElementById("guide").style.display="block";
        cancelAnimationFrame(g_o_time);
    }
}

//충돌
function collision(Character, danger) {
    var d_x = Background.board_padding/2+x+(size/3*danger.dan_x);
    var d_y = Background.board_padding/2+y+(size/3*danger.dan_y);
    var width = size/3-Background.board_padding;
    var height = size/3-Background.board_padding;

    //캐릭터가 위험 구역에 닿았는지 여부
    return ((d_x < Character.chr_x && Character.chr_x < d_x+width) && (d_y < Character.chr_y && Character.chr_y < d_y+height)) ? true : false;
}

document.addEventListener("keydown", function(e) {
    //왼쪽 이동
    if((e.code === 37 || e.key == "ArrowLeft") && Character.chr_x > size/3+x) {
        Character.chr_x -= size/3;
    }
    //오른쪽 이동
    else if((e.code === 39 || e.key == "ArrowRight") && Character.chr_x < size/3*2+x) {
        Character.chr_x += size/3;
    }
    //위 이동
    else if((e.code === 38 || e.key == "ArrowUp") && Character.chr_y > size/3+y) {
        Character.chr_y -= size/3;
    }
    //아래 이동
    else if((e.code === 40 || e.key == "ArrowDown") && Character.chr_y < size/3*2+y) {
        Character.chr_y += size/3;
    }

    //아무키를 누르면 게임 시작
    if(start === false) {
        canvas_reset();
        score = 0;
        timer = 0;
        danger_list.splice(0);
        frame_timer();
        //게임 시작시 UI 숨기기
        document.getElementById("setting").style.display="none";
        document.getElementById("guide").style.display="none";
        start = true;
    }
})

//시작 전
Background.draw();
Character.draw();
var b_score = 0;
document.getElementById("score").innerHTML = score;
document.getElementById("best_score").innerHTML = b_score;
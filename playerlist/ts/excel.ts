import * as fs from 'fs';

interface BaseballPlayer {
    등번호: string;
    이름: string;
    투타유형: string;
    생년월일: string;
    체격: string;
}

// 크롤링한 데이터
const data: string = `
\n\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t등번호\n\t\t\t\t\t\t\t감독\n\t\t\t\t\t\t\t투타유형\n\t\t\t\t\t\t\t생년월일\n\t\t\t\t\t\t\t체격\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t74\n\t\t\t\t\t\t\t\t김경문\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1958-11-01\n\t\t\t\t\t\t\t\t175cm, 78kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t등번호\n\t\t\t\t\t\t\t코치\n\t\t\t\t\t\t\t투타유형\n\t\t\t\t\t\t\t생년월일\n\t\t\t\t\t\t\t체격\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t70\n\t\t\t\t\t\t\t\t강동우\n\t\t\t\t\t\t\t\t좌투좌타\n\t\t\t\t\t\t\t\t1974-04-20\n\t\t\t\t\t\t\t\t177cm, 78kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t76\n\t\t\t\t\t\t\t\t윤규진\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1984-07-28\n\t\t\t\t\t\t\t\t187cm, 91kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t77\n\t\t\t\t\t\t\t\t박재상\n\t\t\t\t\t\t\t\t좌투좌타\n\t\t\t\t\t\t\t\t1982-07-20\n\t\t\t\t\t\t\t\t178cm, 85kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t78\n\t\t\t\t\t\t\t\t김남형\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1988-05-08\n\t\t\t\t\t\t\t\t177cm, 75kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t79\n\t\t\t\t\t\t\t\t양상문\n\t\t\t\t\t\t\t\t좌투좌타\n\t\t\t\t\t\t\t\t1961-03-24\n\t\t\t\t\t\t\t\t175cm, 82kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t82\n\t\t\t\t\t\t\t\t김재걸\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1972-09-07\n\t\t\t\t\t\t\t\t177cm, 70kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t83\n\t\t\t\t\t\t\t\t김우석\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1975-09-02\n\t\t\t\t\t\t\t\t181cm, 79kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t88\n\t\t\t\t\t\t\t\t양승관\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1959-06-02\n\t\t\t\t\t\t\t\t180cm, 82kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t90\n\t\t\t\t\t\t\t\t김정민\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1970-03-15\n\t\t\t\t\t\t\t\t184cm, 83kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t등번호\n\t\t\t\t\t\t\t투수\n\t\t\t\t\t\t\t투타유형\n\t\t\t\t\t\t\t생년월일\n\t\t\t\t\t\t\t체격\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t1\n\t\t\t\t\t\t\t\t문동주\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t2003-12-23\n\t\t\t\t\t\t\t\t188cm, 97kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t15\n\t\t\t\t\t\t\t\t김기중\n\t\t\t\t\t\t\t\t좌투좌타\n\t\t\t\t\t\t\t\t2002-11-16\n\t\t\t\t\t\t\t\t186cm, 96kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t18\n\t\t\t\t\t\t\t\t이상규\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1996-10-20\n\t\t\t\t\t\t\t\t185cm, 77kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t20\n\t\t\t\t\t\t\t\t바리아\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1996-07-18\n\t\t\t\t\t\t\t\t185cm, 95kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t26\n\t\t\t\t\t\t\t\t한승혁\n\t\t\t\t\t\t\t\t우투좌타\n\t\t\t\t\t\t\t\t1993-01-03\n\t\t\t\t\t\t\t\t185cm, 100kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t27\n\t\t\t\t\t\t\t\t이민우\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1993-02-09\n\t\t\t\t\t\t\t\t185cm, 104kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t29\n\t\t\t\t\t\t\t\t황준서\n\t\t\t\t\t\t\t\t좌투좌타\n\t\t\t\t\t\t\t\t2005-08-22\n\t\t\t\t\t\t\t\t185cm, 78kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t54\n\t\t\t\t\t\t\t\t김서현\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t2004-05-31\n\t\t\t\t\t\t\t\t188cm, 86kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t55\n\t\t\t\t\t\t\t\t와이스\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1996-12-10\n\t\t\t\t\t\t\t\t193cm, 100kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t58\n\t\t\t\t\t\t\t\t박상원\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1994-09-09\n\t\t\t\t\t\t\t\t187cm, 98kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t59\n\t\t\t\t\t\t\t\t한승주\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t2001-03-17\n\t\t\t\t\t\t\t\t184cm, 83kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t60\n\t\t\t\t\t\t\t\t김규연\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t2002-08-23\n\t\t\t\t\t\t\t\t183cm, 91kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t66\n\t\t\t\t\t\t\t\t주현상\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1992-08-10\n\t\t\t\t\t\t\t\t177cm, 92kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t99\n\t\t\t\t\t\t\t\t류현진\n\t\t\t\t\t\t\t\t좌투우타\n\t\t\t\t\t\t\t\t1987-03-25\n\t\t\t\t\t\t\t\t190cm, 113kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t등번호\n\t\t\t\t\t\t\t포수\n\t\t\t\t\t\t\t투타유형\n\t\t\t\t\t\t\t생년월일\n\t\t\t\t\t\t\t체격\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t13\n\t\t\t\t\t\t\t\t최재훈\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1989-08-27\n\t\t\t\t\t\t\t\t178cm, 94kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t32\n\t\t\t\t\t\t\t\t이재원\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1988-02-24\n\t\t\t\t\t\t\t\t185cm, 98kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t96\n\t\t\t\t\t\t\t\t장규현\n\t\t\t\t\t\t\t\t우투좌타\n\t\t\t\t\t\t\t\t2002-06-28\n\t\t\t\t\t\t\t\t183cm, 96kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t등번호\n\t\t\t\t\t\t\t내야수\n\t\t\t\t\t\t\t투타유형\n\t\t\t\t\t\t\t생년월일\n\t\t\t\t\t\t\t체격\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t3\n\t\t\t\t\t\t\t\t안치홍\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1990-07-02\n\t\t\t\t\t\t\t\t178cm, 97kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t6\n\t\t\t\t\t\t\t\t한경빈\n\t\t\t\t\t\t\t\t우투좌타\n\t\t\t\t\t\t\t\t1998-12-11\n\t\t\t\t\t\t\t\t178cm, 69kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t7\n\t\t\t\t\t\t\t\t이도윤\n\t\t\t\t\t\t\t\t우투좌타\n\t\t\t\t\t\t\t\t1996-10-07\n\t\t\t\t\t\t\t\t175cm, 79kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t8\n\t\t\t\t\t\t\t\t노시환\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t2000-12-03\n\t\t\t\t\t\t\t\t185cm, 105kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t16\n\t\t\t\t\t\t\t\t하주석\n\t\t\t\t\t\t\t\t우투좌타\n\t\t\t\t\t\t\t\t1994-02-25\n\t\t\t\t\t\t\t\t185cm, 92kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t25\n\t\t\t\t\t\t\t\t김태연\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1997-06-10\n\t\t\t\t\t\t\t\t178cm, 96kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t37\n\t\t\t\t\t\t\t\t김인환\n\t\t\t\t\t\t\t\t우투좌타\n\t\t\t\t\t\t\t\t1994-01-28\n\t\t\t\t\t\t\t\t186cm, 100kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t64\n\t\t\t\t\t\t\t\t문현빈\n\t\t\t\t\t\t\t\t우투좌타\n\t\t\t\t\t\t\t\t2004-04-20\n\t\t\t\t\t\t\t\t174cm, 82kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t95\n\t\t\t\t\t\t\t\t황영묵\n\t\t\t\t\t\t\t\t우투좌타\n\t\t\t\t\t\t\t\t1999-10-16\n\t\t\t\t\t\t\t\t177cm, 80kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t등번호\n\t\t\t\t\t\t\t외야수\n\t\t\t\t\t\t\t투타유형\n\t\t\t\t\t\t\t생년월일\n\t\t\t\t\t\t\t체격\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t17\n\t\t\t\t\t\t\t\t권광민\n\t\t\t\t\t\t\t\t좌투좌타\n\t\t\t\t\t\t\t\t1997-12-12\n\t\t\t\t\t\t\t\t189cm, 102kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t22\n\t\t\t\t\t\t\t\t채은성\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1990-02-06\n\t\t\t\t\t\t\t\t186cm, 92kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t30\n\t\t\t\t\t\t\t\t페라자\n\t\t\t\t\t\t\t\t우투양타\n\t\t\t\t\t\t\t\t1998-11-10\n\t\t\t\t\t\t\t\t175cm, 88kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t33\n\t\t\t\t\t\t\t\t유로결\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t2000-05-30\n\t\t\t\t\t\t\t\t186cm, 83kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t50\n\t\t\t\t\t\t\t\t이원석\n\t\t\t\t\t\t\t\t우투우타\n\t\t\t\t\t\t\t\t1999-03-31\n\t\t\t\t\t\t\t\t177cm, 69kg\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t51\n\t\t\t\t\t\t\t\t장진혁\n\t\t\t\t\t\t\t\t우투좌타\n\t\t\t\t\t\t\t\t1993-09-30\n\t\t\t\t\t\t\t\t184cm, 90kg",
`;

// 공백 및 불필요한 부분 제거하고 리스트로 변환
const cleanedData = data.replace(/[\t\n]+/g, ' ');

// 키와 몸무게 패턴을 유지하면서 단어 리스트를 추출
const elements = cleanedData.match(/\d+cm, \d+kg|[^\s]+/g) || [];

// 5열로 변환 (원하는 대로 설정 가능)
const numColumns = 5;
const rows: BaseballPlayer[] = [];
for (let i = 0; i < elements.length; i += numColumns) {
    const row = elements.slice(i, i + numColumns);
    if (row.length === numColumns) {
        rows.push({
            등번호: row[0],
            이름: row[1],
            투타유형: row[2],
            생년월일: row[3],
            체격: row[4]
        });
    }
}

// 데이터 저장을 위한 Map 생성
const playerMap: Map<string, BaseballPlayer> = new Map();

// Map에 데이터 삽입
rows.forEach((player) => {
    playerMap.set(player.등번호, player);  // 등번호를 키로 사용
});

// 시작과 끝 위치 탐색
const startIdx = rows.findIndex(player => player.이름 === '투수');
const endIdx = rows.findIndex(player => player.이름 === '포수');

// 시작 부분 포함, 끝 부분 제외하여 추출
const filteredData = rows.slice(startIdx, endIdx);

// JSON 파일로 저장하기
fs.writeFileSync('filtered_result.json', JSON.stringify(filteredData, null, 2), 'utf8');
console.log("필터링된 JSON 파일로 저장되었습니다.");

// const qqq: String = "안녕하세요~";

// console.log(qqq);

import { DataSource } from "typeorm";
import { Board } from "./Board.postgres";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// API-DOCS 만들기
const typeDefs = `#graphql
  input CreateBoardInput {
    writer: String
    title:  String
    contents: String
  }

  type MyBoard {
    number: Int
    writer: String
    title:  String
    contents: String
  }

  type Query {
    fetchBoards: [MyBoard]
  }

  type Mutation {
    # 연습용(backend-example 방식)
    # createBoard: (writer: String, title: String, contents: String): String

    # 실무용(backend-pratice 방식)
    createBoard(createBoardInput: CreateBoardInput): String
  }
`;
//필수입력은 !붙이기

// API만들기
const resolvers = {
  Query: {
    fetchBoards: async (parent: any, args: any) => {
      //철수
      console.log(parent);
      //1. 모두 꺼내기
      // const result = await Board.find({ where: { isDeleted: false } });
      const result = await Board.find();
      console.log("result::", result);

      //2. 한개만 꺼내기
      // const result = await Board.findOne({
      //   where: { number: 3 },
      // });
      // console.log("result:::", result);
    },
  },

  //브라우저 요청 args로 값이 들어옴
  Mutation: {
    createBoard: async (parent: any, args: any, context: any, info: any) => {
      await Board.insert({
        ...args.createBoardInput,

        // 하나 하나 모두 입력하는 방식(비효율적)
        // writer: args.createBoardInput.writer,
        // title: args.createBoardInput.title,
        // contents: args.createBoardInput.contents,
      });

      // fetchBoard("철수");

      return "게시글 등록에 성공했어요!!";
    },
    // updateBoard: async () => {
    //   //3번 게시글을 영희로 바꿔줘!
    //   await Board.update({ number: 3 }, { writer: "영희" });
    // },
    // deleteBoard: async () => {
    //   await Board.delete({ number: 3 }); //3번 게시글 삭제해줘!
    //   await Board.update({number:3},{isDeleted:true}}; //3 번게시글 삭제 표시(소프트 딜리트)
    //   await Board.update({number:3},{deletedAt: new Date()}; //  deletedAt이 초기값인 NULL이면?? 삭제 안된 것, new Date() 들어가 있으면? 삭제 된 것
    // },
  },
};

// @ts-ignore
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // cors: true,
  // 내장이 안되고 따로 다운받아서 사용

  //선택한 사이트만 풀어주고 싶을 때
  // cors: {
  //   origin: ["http://naver.com", "http://coupang.com"],
  // },
});

const AppDataSource = new DataSource({
  type: "postgres",
  host: "34.64.244.122",
  port: 5001,
  username: "postgres",
  password: "postgres2022",
  database: "postgres",
  entities: [Board],
  synchronize: true,
});

// logging: true
//하나하나 바뀌는 쿼리문 확인 가능

AppDataSource.initialize()
  .then(() => {
    console.log("DB접속에 성공했습니다!!");
    //서버가 계속 켜져있게 해주는 쿼리
    startStandaloneServer(server)
      .then(() => {
        console.log("그래프큐엘 서버가 실행되었습니다.");
      })
      .catch((error) => {
        console.log("그래프 큐엘 서버가 실행되지않았습니다.::", error);
      });
  })
  .catch((error) => {
    console.log("DB접속에 실패하였씁니다.!!:::", error);
  });

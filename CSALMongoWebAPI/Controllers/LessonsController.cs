﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using CSALMongo.Model;

namespace CSALMongoWebAPI.Controllers {
    public class LessonsController : Util.CSALBaseController {
        // GET api/lessons
        public IEnumerable<Lesson> Get() {
            return DBConn().FindLessons();
        }

        // GET api/lessons/5
        public Lesson Get(string id) {
            return DBConn().FindLesson(id);
        }

        // POST api/lessons/5
        public void Post(string id, [FromBody]string value) {
            Lesson lesson = Utils.ParseJson<Lesson>(value);
            if (lesson.Id != id) {
                throw new InvalidOperationException("Attempt to save mismatched Lesson");
            }
            DBConn().SaveLesson(lesson);
        }
    }
}

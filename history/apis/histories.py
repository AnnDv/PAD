from flask import request, make_response, jsonify
from flask_restx import Namespace, Resource
from marshmallow.exceptions import ValidationError

from history.schemas.histories import HISTORYDetailSchema, HISTORYBaseSchema

histories_ns = Namespace("histories")


@histories_ns.route("/")
class HISTORYResource(Resource):
    def get(self):
        """
        List all HISTORY
        """

        TODO_LIST = [
            {
                "_id": "1",
                "user_id": "1",
                "phrase": "I'am SHERlocked",
            },
            {
                "_id": "2",
                "user_id": "2",
                "phrase": "I'am Moriarty",
            }
        ]

        return HISTORYDetailSchema().dump(TODO_LIST, many=True)

    def post(self):
        """
        Create a new TODO
        """
        payload = request.get_json()
        try:
            data = TODOBaseSchema().load(payload)
            data["_id"] = "4"
        except ValidationError as e:
            return make_response(jsonify(message=e.messages), 400)

        return TODODetailSchema().dump(data)


@todos_ns.route("/<string:tid>/")
class TODODetailResource(Resource):
    def put(self, tid):
        """
        Update a TODO
        """
        return {"message": f"Update todo {tid}"}

    def delete(self, tid):
        """
        Delete TODO
        """
        return {"message": f"Delete todo {tid}"}
from marshmallow import Schema, fields
from marshmallow.validate import Length


class HISTORYBaseSchema(Schema):
    user_id = fields.String(required=True, validate=Length(max=50))
    phrase = fields.String(required=True, validate=Length(max=200))


class HISTORYDetailSchema(HISTORYBaseSchema):
    _id = fields.String(required=True)
"""
Small helpers so every endpoint returns the same envelope shape, per the
Phase 1 API spec:

    { "success": true,  "data": {...}, "message": "optional" }
    { "success": false, "error": { "code": "...", "message": "..." } }
"""
from rest_framework.response import Response


def success(data=None, message=None, status=200):
    payload = {'success': True, 'data': data}
    if message:
        payload['message'] = message
    return Response(payload, status=status)


def error(message, code='ERROR', status=400):
    return Response(
        {'success': False, 'error': {'code': code, 'message': message}},
        status=status,
    )
